import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { cosmosHubCaip2, cosmosHubRestBaseUrl } from '$/constants/CosmosNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { CosmosSdkTxResponse } from '$/sources/CosmosSdk/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertCosmosHub = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== cosmosHubCaip2.namespace
		|| network.caip2.reference !== cosmosHubCaip2.reference
	) {
		throw new Error('CosmosSdk_Rest: unsupported network')
	}
}

const cosmosValidatorFields = (validator: {
	operator_address?: string
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

const cosmosValidatorRows = (
	network: NetworkId,
	validators: Parameters<typeof cosmosValidatorFields>[0][],
) => (
	validators.flatMap((validator) => (
		validator.operator_address == null ?
			[]
		:
			[{
				[EntityMetaKey.Id]: {
					$network: network,
					operatorAddress: validator.operator_address,
				},
				...cosmosValidatorFields(validator),
			}]
	))
)

const cosmosProposalRows = (
	network: NetworkId,
	proposals: {
		id: string
		title?: string
		status: string
		messages?: {
			content?: {
				title?: string
			}
		}[]
	}[],
) => (
	proposals.map((proposal) => ({
		[EntityMetaKey.Id]: {
			$network: network,
			proposalId: proposal.id,
		},
		title: proposal.title ?? proposal.messages?.[0]?.content?.title,
		status: proposal.status,
	}))
)

const cosmosMessageRows = (
	entityId: {
		$network: NetworkId
		txHash: string
	},
	wireTransaction: CosmosSdkTxResponse,
) => (
	(wireTransaction.tx?.body?.messages ?? []).map((message, messageIndex) => ({
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
			entityType: EntityType.CosmosNetwork,
			resolve: async (entityId) => {
				assertCosmosHub(entityId)
				return {
					$network: {
						[EntityMetaKey.Id]: entityId,
					},
					restEndpoints: [
						{
							url: cosmosHubRestBaseUrl,
							transportType: TransportType.Http,
							providerName: 'PublicNode',
						},
					],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosNetwork_Timestamp,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const {
					getLatestBlock,
					getNodeInfo,
					getProposals,
					getStakingPool,
					getSyncing,
					getValidators,
				} = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const [
					latestBlock,
					nodeInfo,
					syncing,
					validators,
					stakingPool,
					proposals,
				] = await Promise.all([
					getLatestBlock({ restBaseUrl: cosmosHubRestBaseUrl }),
					getNodeInfo({ restBaseUrl: cosmosHubRestBaseUrl }),
					getSyncing({ restBaseUrl: cosmosHubRestBaseUrl }),
					getValidators({ restBaseUrl: cosmosHubRestBaseUrl }),
					getStakingPool({ restBaseUrl: cosmosHubRestBaseUrl }),
					getProposals({ restBaseUrl: cosmosHubRestBaseUrl }),
				])
				return {
					latestBlockHeight: BigInt(latestBlock.block.header.height),
					latestBlockHash: latestBlock.block_id.hash,
					latestBlockTimeMs: Date.parse(latestBlock.block.header.time),
					latestBlockTransactionCount: latestBlock.block.data.txs?.length ?? 0,
					chainId: nodeInfo.default_node_info.network,
					nodeNetwork: nodeInfo.default_node_info.network,
					applicationName: nodeInfo.application_version?.app_name ?? nodeInfo.application_version?.name,
					applicationVersion: nodeInfo.application_version?.version,
					cosmosSdkVersion: nodeInfo.application_version?.cosmos_sdk_version,
					isSyncing: syncing.syncing,
					validatorCount: validators.pagination?.total == null ? validators.validators.length : Number(validators.pagination.total),
					bondedValidatorCount: validators.validators.filter((validator) => validator.status === 'BOND_STATUS_BONDED').length,
					bondedTokens: BigInt(stakingPool.pool.bonded_tokens),
					notBondedTokens: BigInt(stakingPool.pool.not_bonded_tokens),
					governanceProposalCount: proposals.pagination?.total == null ? proposals.proposals.length : Number(proposals.pagination.total),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosBlock,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getBlock } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const wireBlock = await getBlock({
					restBaseUrl: cosmosHubRestBaseUrl,
					height: entityId.height,
				})
				return {
					hash: wireBlock.block_id.hash,
					proposerConsensusAddress: wireBlock.block.header.proposer_address,
					timestampMs: Date.parse(wireBlock.block.header.time),
					transactionCount: wireBlock.block.data.txs?.length ?? 0,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosTransaction,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const wireTransaction = await getTx({
					restBaseUrl: cosmosHubRestBaseUrl,
					txHash: entityId.txHash,
				})
				return {
					$block: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							height: BigInt(wireTransaction.tx_response.height),
						},
					},
					code: wireTransaction.tx_response.code,
					gasWanted: BigInt(wireTransaction.tx_response.gas_wanted),
					gasUsed: BigInt(wireTransaction.tx_response.gas_used),
					memo: wireTransaction.tx?.body?.memo,
					$$messages: cosmosMessageRows(
					entityId,
					wireTransaction,
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
					restBaseUrl: cosmosHubRestBaseUrl,
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
					restBaseUrl: cosmosHubRestBaseUrl,
					operatorAddress: entityId.operatorAddress,
				})).validator)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosMessage,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$transaction.$network)
				const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const cosmosMessage = cosmosMessageRows(
					entityId.$transaction,
					await getTx({
						restBaseUrl: cosmosHubRestBaseUrl,
						txHash: entityId.$transaction.txHash,
					}),
				).at(entityId.messageIndex)
				if (cosmosMessage == null) throw new Error(`CosmosSdk_Rest: message not found for ${entityId.$transaction.txHash}:${entityId.messageIndex}`)
				return cosmosMessage
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosGovernanceProposal,
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getProposal } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const proposal = (await getProposal({
					restBaseUrl: cosmosHubRestBaseUrl,
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
					restBaseUrl: cosmosHubRestBaseUrl,
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
						restBaseUrl: cosmosHubRestBaseUrl,
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
					restBaseUrl: cosmosHubRestBaseUrl,
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
			entityType: EntityType.CosmosNetwork,
			fieldName: 'restEndpoints',
			resolve: async (entityId) => {
				assertCosmosHub(entityId)
				return [
					{
						url: cosmosHubRestBaseUrl,
						transportType: TransportType.Http,
						providerName: 'PublicNode',
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CosmosNetwork,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				assertCosmosHub(entityId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CosmosNetwork,
			fieldName: '$$blocks',
			resolve: async (entityId, context) => {
				assertCosmosHub(entityId)
				const { getLatestBlock } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				const latestBlock = await getLatestBlock({ restBaseUrl: cosmosHubRestBaseUrl })
				const latestBlockHeight = BigInt(latestBlock.block.header.height)
				return Array.from({
					length: Math.min(
						Number(latestBlockHeight + 1n),
						resolverLoadSubsetRowLimit(context),
					),
				}, (_value, blockOffset) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						height: latestBlockHeight - BigInt(blockOffset),
					},
					...(blockOffset === 0 && {
						hash: latestBlock.block_id.hash,
						proposerConsensusAddress: latestBlock.block.header.proposer_address,
						timestampMs: Date.parse(latestBlock.block.header.time),
						transactionCount: latestBlock.block.data.txs?.length ?? 0,
					}),
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CosmosNetwork,
			fieldName: '$$validators',
			resolve: async (entityId) => {
				assertCosmosHub(entityId)
				const { getValidators } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				return cosmosValidatorRows(
					entityId,
					(await getValidators({ restBaseUrl: cosmosHubRestBaseUrl })).validators,
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CosmosNetwork,
			fieldName: '$$governanceProposals',
			resolve: async (entityId) => {
				assertCosmosHub(entityId)
				const { getProposals } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				return cosmosProposalRows(
					entityId,
					(await getProposals({ restBaseUrl: cosmosHubRestBaseUrl })).proposals,
				)
			},
		}),


		defineEntityFieldResolver({
			entityType: EntityType.CosmosTransaction,
			fieldName: '$$messages',
			resolve: async (entityId) => {
				assertCosmosHub(entityId.$network)
				const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
				return cosmosMessageRows(
					entityId,
					await getTx({
						restBaseUrl: cosmosHubRestBaseUrl,
						txHash: entityId.txHash,
					}),
				)
			},
		}),
	],
}
