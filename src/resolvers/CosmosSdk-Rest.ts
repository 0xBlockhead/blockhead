import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { cosmosNetworkBySlug } from '$/constants/CosmosNetwork.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { CosmosSdkTxResponse } from '$/sources/CosmosSdk/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { CosmosNetworkSelector } from '$/schema/CosmosNetwork.ts'
import { CosmosNetwork_TimestampSelector } from '$/schema/CosmosNetwork_Timestamp.ts'
import { CosmosBlockSelector } from '$/schema/CosmosBlock.ts'
import { CosmosTransactionSelector } from '$/schema/CosmosTransaction.ts'
import { CosmosAccountSelector } from '$/schema/CosmosAccount.ts'
import { CosmosAccount_TimestampSelector } from '$/schema/CosmosAccount_Timestamp.ts'
import { CosmosValidatorSelector } from '$/schema/CosmosValidator.ts'
import { CosmosValidator_TimestampSelector } from '$/schema/CosmosValidator_Timestamp.ts'
import { CosmosMessageSelector } from '$/schema/CosmosMessage.ts'
import { CosmosGovernanceProposalSelector } from '$/schema/CosmosGovernanceProposal.ts'
import { CosmosGovernanceProposal_TimestampSelector } from '$/schema/CosmosGovernanceProposal_Timestamp.ts'
import { CosmosDenomSelector } from '$/schema/CosmosDenom.ts'
import { CosmosModuleSelector } from '$/schema/CosmosModule.ts'
import { CosmosContractSelector } from '$/schema/CosmosContract.ts'
import { schema } from '$/schema/index.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertCosmosHub = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === 'cosmos'
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === cosmosNetworkBySlug.cosmos.caip2.namespace
			&& network.caip2.reference === cosmosNetworkBySlug.cosmos.caip2.reference
		)
	) {
		return
	}

	throw new Error('CosmosSdk_Rest: unsupported network')
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
})

const cosmosValidatorRows = (
	network: NetworkId,
	validators: Parameters<typeof cosmosValidatorFields>[0][]
) => (
	validators.flatMap((validator) => (
		validator.operator_address == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					$network: network,
					operatorAddress: validator.operator_address,
				},
				...cosmosValidatorFields(validator),
				$$timestamps: [
					cosmosValidatorTimestampFields({
						$network: network,
						operatorAddress: validator.operator_address,
					}, validator, Date.now()),
				],
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
	}[]
) => (
	proposals.map((proposal) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			proposalId: proposal.id,
		},
		title: proposal.title ?? proposal.messages?.[0]?.content?.title,
		$$timestamps: [
			cosmosProposalTimestampFields({
				$network: network,
				proposalId: proposal.id,
			}, proposal, Date.now()),
		],
	}))
)

const cosmosAccountTimestampFields = (
	accountId: {
		$network: NetworkId
		address: string
	},
	account: {
		account_number?: string
		sequence?: string
		base_account?: {
			account_number?: string
			sequence?: string
		}
	} | undefined,
	timestampMs: number
) => ({
	[EntityMetaKey.Selector]: {
		$account: accountId,
		timestampMs,
		source: Source.CosmosSdk_Rest,
	},
	$account: {
		[EntityMetaKey.Selector]: accountId,
	},
	timestampMs,
	source: Source.CosmosSdk_Rest,
	...((account?.base_account?.account_number ?? account?.account_number) != null && {
		accountNumber: BigInt((account?.base_account?.account_number ?? account?.account_number) ?? '0'),
	}),
	...((account?.base_account?.sequence ?? account?.sequence) != null && {
		sequence: BigInt((account?.base_account?.sequence ?? account?.sequence) ?? '0'),
	}),
})

const cosmosValidatorTimestampFields = (
	validatorId: {
		$network: NetworkId
		operatorAddress: string
	},
	validator: Parameters<typeof cosmosValidatorFields>[0],
	timestampMs: number
) => ({
	[EntityMetaKey.Selector]: {
		$validator: validatorId,
		timestampMs,
		source: Source.CosmosSdk_Rest,
	},
	$validator: {
		[EntityMetaKey.Selector]: validatorId,
	},
	timestampMs,
	source: Source.CosmosSdk_Rest,
	jailed: validator.jailed,
	status: validator.status,
	tokens: BigInt(validator.tokens),
})

const cosmosProposalTimestampFields = (
	proposalId: {
		$network: NetworkId
		proposalId: string
	},
	proposal: {
		status: string
	},
	timestampMs: number
) => ({
	[EntityMetaKey.Selector]: {
		$proposal: proposalId,
		timestampMs,
		source: Source.CosmosSdk_Rest,
	},
	$proposal: {
		[EntityMetaKey.Selector]: proposalId,
	},
	timestampMs,
	source: Source.CosmosSdk_Rest,
	status: proposal.status,
})

const cosmosMessageRows = (
	entitySelector: {
		$network: NetworkId
		txHash: string
	},
	wireTransaction: CosmosSdkTxResponse
) => (
	(wireTransaction.tx?.body?.messages ?? []).map((message, indexInTransaction) => ({
		[EntityMetaKey.Selector]: {
			$transaction: entitySelector,
			indexInTransaction,
		},
		typeUrl: message['@type'] ?? 'unknown',
		...((message.signer ?? message.sender) != null && {
			$signer: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					address: (message.signer ?? message.sender) ?? '',
				},
			},
		}),
		...(message.contract != null && {
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					address: message.contract,
				},
			},
		}),
	}))
)

export default {
	source: Source.CosmosSdk_Rest,

	resolvers: [
		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosNetwork,
			resolve: {
				[CosmosNetworkSelector.Network]: async ({ $network }) => {
					assertCosmosHub($network)
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
							restEndpoints: [
								{
									url: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
									transportType: TransportType.Http,
									providerName: 'PublicNode',
								},
							],
					}
				}
			},
		})({
			fields: {
				$network: (network) => network.$network,
				restEndpoints: (network) => network.restEndpoints,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosNetwork_Timestamp,
			resolve: {
				[CosmosNetwork_TimestampSelector.NetworkTimestampMsSource]: async ({
					$network,
					timestampMs,
					source,
				}) => {
					if (source !== Source.CosmosSdk_Rest)
						throw new Error('CosmosSdk_Rest: unsupported network timestamp source')
					assertCosmosHub($network)
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
						getLatestBlock({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
						getNodeInfo({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
						getSyncing({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
						getValidators({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
						getStakingPool({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
						getProposals({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
					])
					return {
						$network: {
							[EntityMetaKey.Selector]: $network,
						},
						timestampMs,
						source,
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
				}
			},
		})({
			fields: {
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				latestBlockHeight: (timestamp) => timestamp.latestBlockHeight,
				latestBlockHash: (timestamp) => timestamp.latestBlockHash,
				latestBlockTimeMs: (timestamp) => timestamp.latestBlockTimeMs,
				latestBlockTransactionCount: (timestamp) => timestamp.latestBlockTransactionCount,
				chainId: (timestamp) => timestamp.chainId,
				nodeNetwork: (timestamp) => timestamp.nodeNetwork,
				applicationName: (timestamp) => timestamp.applicationName,
				applicationVersion: (timestamp) => timestamp.applicationVersion,
				cosmosSdkVersion: (timestamp) => timestamp.cosmosSdkVersion,
				isSyncing: (timestamp) => timestamp.isSyncing,
				validatorCount: (timestamp) => timestamp.validatorCount,
				bondedValidatorCount: (timestamp) => timestamp.bondedValidatorCount,
				bondedTokens: (timestamp) => timestamp.bondedTokens,
				notBondedTokens: (timestamp) => timestamp.notBondedTokens,
				governanceProposalCount: (timestamp) => timestamp.governanceProposalCount,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosBlock,
			resolve: {
				[CosmosBlockSelector.NetworkHeight]: async ({ $network, height }) => {
					assertCosmosHub($network)

					const { getBlock } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const wireBlock = await getBlock({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
						height,
					})
					return {
						hash: wireBlock.block_id.hash,
						proposerConsensusAddress: wireBlock.block.header.proposer_address,
						timestampMs: Date.parse(wireBlock.block.header.time),
						transactionCount: wireBlock.block.data.txs?.length ?? 0,
					}
				}
			},
		})({
			fields: {
				hash: (block) => block.hash,
				proposerConsensusAddress: (block) => block.proposerConsensusAddress,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosTransaction,
			resolve: {
				[CosmosTransactionSelector.NetworkTxHash]: async (entitySelector) => {
					assertCosmosHub(entitySelector.$network)
					const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const wireTransaction = await getTx({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
						txHash: entitySelector.txHash,
					})
					return {
						$block: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								height: BigInt(wireTransaction.tx_response.height),
							},
						},
						code: wireTransaction.tx_response.code,
						gasWanted: BigInt(wireTransaction.tx_response.gas_wanted),
						gasUsed: BigInt(wireTransaction.tx_response.gas_used),
						memo: wireTransaction.tx?.body?.memo,
						$$messages: cosmosMessageRows(
							entitySelector,
							wireTransaction
					),
					}
				}
			},
		})({
			fields: {
				$block: (transaction) => transaction.$block,
				code: (transaction) => transaction.code,
				gasWanted: (transaction) => transaction.gasWanted,
				gasUsed: (transaction) => transaction.gasUsed,
				memo: (transaction) => transaction.memo,
				$$messages: (transaction) => transaction.$$messages,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosAccount,
			resolve: {
				[CosmosAccountSelector.NetworkAddress]: async (entitySelector) => {
					const { $network, address } = entitySelector
					assertCosmosHub($network)
					const { getAccount } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const account = (await getAccount({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
						address: address,
					})).account
					return {
						$$timestamps: [
							cosmosAccountTimestampFields(entitySelector, account, Date.now()),
						],
					}
				}
			},
		})({
			fields: {
				$$timestamps: (account) => account.$$timestamps,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosAccount_Timestamp,
			resolve: {
				[CosmosAccount_TimestampSelector.AccountTimestampMsSource]: async ({
					$account,
					timestampMs,
					source,
				}) => {
					if (source !== Source.CosmosSdk_Rest)
						throw new Error('CosmosSdk_Rest: unsupported account timestamp source')
					assertCosmosHub($account.$network)
					const { getAccount } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					return cosmosAccountTimestampFields(
						$account,
						(await getAccount({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							address: $account.address,
						})).account,
						timestampMs
					)
				},
			},
		})({
			fields: {
				$account: (account) => account.$account,
				timestampMs: (account) => account.timestampMs,
				source: (account) => account.source,
				accountNumber: (account) => account.accountNumber,
				sequence: (account) => account.sequence,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosValidator,
			resolve: {
				[CosmosValidatorSelector.NetworkOperatorAddress]: async (entitySelector) => {
					const { $network, operatorAddress } = entitySelector
					assertCosmosHub($network)
					const { getValidator } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const validator = (await getValidator({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
						operatorAddress: operatorAddress,
					})).validator
					return {
						...cosmosValidatorFields(validator),
						$$timestamps: [
							cosmosValidatorTimestampFields(entitySelector, validator, Date.now()),
						],
					}
				}
			},
		})({
			fields: {
				consensusPubkey: (validator) => validator.consensusPubkey,
				moniker: (validator) => validator.moniker,
				$$timestamps: (validator) => validator.$$timestamps,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosValidator_Timestamp,
			resolve: {
				[CosmosValidator_TimestampSelector.ValidatorTimestampMsSource]: async ({
					$validator,
					timestampMs,
					source,
				}) => {
					if (source !== Source.CosmosSdk_Rest)
						throw new Error('CosmosSdk_Rest: unsupported validator timestamp source')
					assertCosmosHub($validator.$network)
					const { getValidator } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					return cosmosValidatorTimestampFields(
						$validator,
						(await getValidator({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							operatorAddress: $validator.operatorAddress,
						})).validator,
						timestampMs
					)
				},
			},
		})({
			fields: {
				$validator: (validator) => validator.$validator,
				timestampMs: (validator) => validator.timestampMs,
				source: (validator) => validator.source,
				jailed: (validator) => validator.jailed,
				status: (validator) => validator.status,
				tokens: (validator) => validator.tokens,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosMessage,
			resolve: {
				[CosmosMessageSelector.TransactionIndexInTransaction]: async ({ $transaction, indexInTransaction }) => {
					assertCosmosHub($transaction.$network)
					const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const cosmosMessage = cosmosMessageRows(
						$transaction,
						await getTx({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							txHash: $transaction.txHash,
						})
						).at(indexInTransaction)
					if (cosmosMessage == null) throw new Error(`CosmosSdk_Rest: message not found for ${$transaction.txHash}:${indexInTransaction}`)
					return cosmosMessage
				}
			},
		})({
			fields: {
				typeUrl: (message) => message.typeUrl,
				$signer: (message) => message.$signer,
				$contract: (message) => message.$contract,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosGovernanceProposal,
			resolve: {
				[CosmosGovernanceProposalSelector.NetworkProposalId]: async (entitySelector) => {
					const { $network, proposalId } = entitySelector
					assertCosmosHub($network)
					const { getProposal } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const proposal = (await getProposal({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
						proposalId: proposalId,
					})).proposal
					return {
						title: proposal.title ?? proposal.messages?.[0]?.content?.title,
						summary: proposal.summary ?? proposal.messages?.[0]?.content?.description,
						$$timestamps: [
							cosmosProposalTimestampFields(entitySelector, proposal, Date.now()),
						],
					}
				}
			},
		})({
			fields: {
				title: (proposal) => proposal.title,
				summary: (proposal) => proposal.summary,
				$$timestamps: (proposal) => proposal.$$timestamps,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosGovernanceProposal_Timestamp,
			resolve: {
				[CosmosGovernanceProposal_TimestampSelector.ProposalTimestampMsSource]: async ({
					$proposal,
					timestampMs,
					source,
				}) => {
					if (source !== Source.CosmosSdk_Rest)
						throw new Error('CosmosSdk_Rest: unsupported governance proposal timestamp source')
					assertCosmosHub($proposal.$network)
					const { getProposal } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					return cosmosProposalTimestampFields(
						$proposal,
						(await getProposal({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							proposalId: $proposal.proposalId,
						})).proposal,
						timestampMs
					)
				},
			},
		})({
			fields: {
				$proposal: (proposal) => proposal.$proposal,
				timestampMs: (proposal) => proposal.timestampMs,
				source: (proposal) => proposal.source,
				status: (proposal) => proposal.status,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosDenom,
			resolve: {
				[CosmosDenomSelector.NetworkDenom]: async ({ $network, denom }) => {
					assertCosmosHub($network)
					const { getDenomMetadata } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const metadata = (await getDenomMetadata({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
						denom: denom,
					})).metadata
					return {
						display: metadata.display,
						base: metadata.base,
						symbol: metadata.symbol,
					}
				}
			},
		})({
			fields: {
				display: (denom) => denom.display,
				base: (denom) => denom.base,
				symbol: (denom) => denom.symbol,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosModule,
			resolve: {
				[CosmosModuleSelector.NetworkModuleName]: async ({ $network, moduleName }) => {
					assertCosmosHub($network)
					const { getModuleAccount } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const moduleAccount = await getModuleAccount({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
						moduleName: moduleName,
					})
					return {
						...(moduleAccount.account?.base_account?.address != null && {
							$authority: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									address: moduleAccount.account.base_account.address,
								},
							},
						}),
					}
				}
			},
		})({
			fields: {
				$authority: (module) => module.$authority,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosContract,
			resolve: {
				[CosmosContractSelector.NetworkAddress]: async ({ $network, address }) => {
					assertCosmosHub($network)
					const { getContractInfo } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const contractInfo = (await getContractInfo({
						restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
						address: address,
					})).contract_info
					return {
						codeId: BigInt(contractInfo.code_id),
						$creator: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								address: contractInfo.creator,
							},
						},
						...(contractInfo.admin != null && {
							$admin: {
								[EntityMetaKey.Selector]: {
									$network: $network,
									address: contractInfo.admin,
								},
							},
						}),
					}
				}
			},
		})({
			fields: {
				codeId: (contract) => contract.codeId,
				$creator: (contract) => contract.$creator,
				$admin: (contract) => contract.$admin,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosNetwork,
			resolve: {
				[CosmosNetworkSelector.Network]: async ({ $network }) => {
					assertCosmosHub($network)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: $network,
								timestampMs: Date.now(),
								source: Source.CosmosSdk_Rest,
							},
						},
					]
				}
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosNetwork,
			resolve: {
				[CosmosNetworkSelector.Network]: async ({ $network }, context) => {
					assertCosmosHub($network)
					const { getLatestBlock } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					const latestBlock = await getLatestBlock({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl })
					const latestBlockHeight = BigInt(latestBlock.block.header.height)
					return Array.from({
						length: Math.min(
							Number(latestBlockHeight + 1n),
							resolverContextRowLimit(context)
					),
					}, (_value, blockOffset) => ({
						[EntityMetaKey.Selector]: {
							$network: $network,
							height: latestBlockHeight - BigInt(blockOffset),
						},
						...(blockOffset === 0 && {
							hash: latestBlock.block_id.hash,
							proposerConsensusAddress: latestBlock.block.header.proposer_address,
							timestampMs: Date.parse(latestBlock.block.header.time),
							transactionCount: latestBlock.block.data.txs?.length ?? 0,
						}),
					}))
				}
			},
		})({
			fields: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosNetwork,
			resolve: {
				[CosmosNetworkSelector.Network]: async ({ $network }) => {
					assertCosmosHub($network)
					const { getValidators } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					return cosmosValidatorRows(
						$network,
						(await getValidators({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl })).validators
					)
				}
			},
		})({
			fields: {
				$$validators: (validators) => validators,
			},
		}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosNetwork,
			resolve: {
				[CosmosNetworkSelector.Network]: async ({ $network }) => {
					assertCosmosHub($network)
					const { getProposals } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					return cosmosProposalRows(
						$network,
						(await getProposals({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl })).proposals
					)
				}
			},
		})({
			fields: {
				$$governanceProposals: (proposals) => proposals,
			},
		}),


		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosTransaction,
			resolve: {
				[CosmosTransactionSelector.NetworkTxHash]: async (entitySelector) => {
					assertCosmosHub(entitySelector.$network)
					const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
					return cosmosMessageRows(
						entitySelector,
						await getTx({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							txHash: entitySelector.txHash,
						})
					)
				}
			},
		})({
			fields: {
				$$messages: (messages) => messages,
			},
		}),
	],
}
