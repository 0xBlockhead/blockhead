import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { CosmosSdkTxResponse } from '$/sources/CosmosSdk/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const cosmosHubRestUrl = 'https://cosmos-rest.publicnode.com'

const assertCosmosHub = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Cosmos || network.reference !== 'cosmoshub-4') {
		throw new Error(`CosmosSdk_Rest: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const cosmosValidatorFields = (validator: {
	consensus_pubkey?: JsonValue
	description?: {
		moniker?: string
	}
	jailed: boolean
	status: string
	tokens: string
}) => ({
	...(validator.consensus_pubkey != null && {
		consensusPubkey: JSON.stringify(validator.consensus_pubkey),
	}),
	moniker: validator.description?.moniker,
	jailed: validator.jailed,
	status: validator.status,
	tokens: BigInt(validator.tokens),
})

const cosmosMessageRows = (
	entityId: {
		$network: {
			namespace: string
			reference: string
		}
		txHash: string
	},
	row: CosmosSdkTxResponse,
) => (
	(row.tx?.body?.messages ?? []).map((message, messageIndex) => ({
		[EntityMetaKey.Id]: {
			$transaction: entityId,
			messageIndex,
		},
		typeUrl: message['@type'] ?? 'unknown',
		...((message.signer ?? message.sender) != null && {
			$signer: {
				[EntityMetaKey.Id]: {
					$network: entityId.$network,
					address: (message.signer ?? message.sender) ?? '',
				},
			},
		}),
		...(message.contract != null && {
			$contract: {
				[EntityMetaKey.Id]: {
					$network: entityId.$network,
					address: message.contract,
				},
			},
		}),
	}))
)

export default {
	source: Source.CosmosSdk_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.CosmosBlock,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getBlock } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const row = await getBlock({
					restBaseUrl: cosmosHubRestUrl,
					height: entityId.height,
				})
				return {
					hash: row.block_id.hash,
					proposerConsensusAddress: row.block.header.proposer_address,
					timestampMs: Date.parse(row.block.header.time),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosTransaction,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const row = await getTx({
					restBaseUrl: cosmosHubRestUrl,
					txHash: entityId.txHash,
				})
				return {
					$block: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							height: BigInt(row.tx_response.height),
						},
					},
					code: row.tx_response.code,
					gasWanted: BigInt(row.tx_response.gas_wanted),
					gasUsed: BigInt(row.tx_response.gas_used),
					memo: row.tx?.body?.memo,
					$$messages: cosmosMessageRows(
						entityId,
						row,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosAccount,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getAccount } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const account = (await getAccount({
					restBaseUrl: cosmosHubRestUrl,
					address: entityId.address,
				})).account
				return {
					...((account?.base_account?.account_number ?? account?.account_number) != null && {
						accountNumber: BigInt((account?.base_account?.account_number ?? account?.account_number) ?? '0'),
					}),
					...((account?.base_account?.sequence ?? account?.sequence) != null && {
						sequence: BigInt((account?.base_account?.sequence ?? account?.sequence) ?? '0'),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosValidator,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getValidator } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				return cosmosValidatorFields((await getValidator({
					restBaseUrl: cosmosHubRestUrl,
					operatorAddress: entityId.operatorAddress,
				})).validator)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosMessage,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$transaction.$network)
				const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const row = cosmosMessageRows(
					entityId.$transaction,
					await getTx({
						restBaseUrl: cosmosHubRestUrl,
						txHash: entityId.$transaction.txHash,
					}),
				)[entityId.messageIndex]
				if (row == null) throw new Error(`CosmosSdk_Rest: message not found for ${entityId.$transaction.txHash}:${entityId.messageIndex}`)
				return row
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosGovernanceProposal,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getProposal } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const proposal = (await getProposal({
					restBaseUrl: cosmosHubRestUrl,
					proposalId: entityId.proposalId,
				})).proposal
				return {
					title: proposal.title ?? proposal.messages?.[0]?.content?.title,
					status: proposal.status,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosDenom,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getDenomMetadata } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const metadata = (await getDenomMetadata({
					restBaseUrl: cosmosHubRestUrl,
					denom: entityId.denom,
				})).metadata
				return {
					display: metadata.display,
					base: metadata.base,
					symbol: metadata.symbol,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosModule,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getModuleAccount } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				return {
					authority: (await getModuleAccount({
						restBaseUrl: cosmosHubRestUrl,
						moduleName: entityId.moduleName,
					})).account?.base_account?.address,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosContract,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getContractInfo } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const contractInfo = (await getContractInfo({
					restBaseUrl: cosmosHubRestUrl,
					address: entityId.address,
				})).contract_info
				return {
					codeId: BigInt(contractInfo.code_id),
					$creator: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							address: contractInfo.creator,
						},
					},
					...(contractInfo.admin != null && {
						$admin: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								address: contractInfo.admin,
							},
						},
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [






		defineEntityFieldResolver({
			entityType: EntityType.CosmosTransaction,
			fieldName: '$$messages',
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				return cosmosMessageRows(
					entityId,
					await getTx({
						restBaseUrl: cosmosHubRestUrl,
						txHash: entityId.txHash,
					}),
				)
			},
		}),
	],
}
