import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { cosmosNetworkBySlug } from '$/constants/CosmosNetwork.ts'
import {
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type {
	CosmosSdkAccount,
	CosmosSdkTxResponse,
} from '$/sources/CosmosSdk/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { Network_TimestampSelector } from '$/schema/Network_Timestamp.ts'
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

const cosmosNetworkApplicability = [
	{
		caip2: cosmosNetworkBySlug.cosmos.caip2,
	},
	{
		slug: 'cosmos',
	},
] as const

const cosmosNetworkReferenceApplicability = [
	{
		$network: cosmosNetworkApplicability[0],
	},
	{
		$network: cosmosNetworkApplicability[1],
	},
] as const

const cosmosNetworkTimestampApplicability = [
	{
		...cosmosNetworkReferenceApplicability[0],
		source: Source.CosmosSdk_Rest,
	},
	{
		...cosmosNetworkReferenceApplicability[1],
		source: Source.CosmosSdk_Rest,
	},
] as const

const cosmosAccountTimestampApplicability = [
	{
		$account: cosmosNetworkReferenceApplicability[0],
		source: Source.CosmosSdk_Rest,
	},
	{
		$account: cosmosNetworkReferenceApplicability[1],
		source: Source.CosmosSdk_Rest,
	},
] as const

const cosmosValidatorTimestampApplicability = [
	{
		$validator: cosmosNetworkReferenceApplicability[0],
		source: Source.CosmosSdk_Rest,
	},
	{
		$validator: cosmosNetworkReferenceApplicability[1],
		source: Source.CosmosSdk_Rest,
	},
] as const

const cosmosTransactionReferenceApplicability = [
	{
		$transaction: cosmosNetworkReferenceApplicability[0],
	},
	{
		$transaction: cosmosNetworkReferenceApplicability[1],
	},
] as const

const cosmosProposalTimestampApplicability = [
	{
		$proposal: cosmosNetworkReferenceApplicability[0],
		source: Source.CosmosSdk_Rest,
	},
	{
		$proposal: cosmosNetworkReferenceApplicability[1],
		source: Source.CosmosSdk_Rest,
	},
] as const

const cosmosPaginationCount = (
	total: string | undefined,
	label: string
) => {
	if (total == null)
		throw new Error(`CosmosSdk_Rest: ${label} pagination total missing`)

	const count = Number(total)
	if (!Number.isSafeInteger(count) || count < 0)
		throw new Error(`CosmosSdk_Rest: invalid ${label} pagination total ${total}`)

	return count
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
			cosmosProposalTimestampReference({
				$network: network,
				proposalId: proposal.id,
			}, proposal, Date.now()),
		],
	}))
)

const cosmosAccountBaseFields = (account: CosmosSdkAccount) => (
	account.base_account
	?? account.base_vesting_account?.base_account
	?? account
)

const cosmosAccountRows = (
	network: NetworkId,
	accounts: CosmosSdkAccount[]
) => (
	accounts.flatMap((account) => {
		const accountBaseFields = cosmosAccountBaseFields(account)
		if (accountBaseFields.address == null)
			return []

		const accountId = {
			$network: network,
			address: accountBaseFields.address,
		}
		return [{
			[EntityMetaKey.Selector]: accountId,
			$$timestamps: [
				cosmosAccountTimestampFields(accountId, account, Date.now()),
			],
		}]
	})
)

const cosmosAccountTimestampFields = (
	accountId: {
		$network: NetworkId
		address: string
	},
	account: {
		address?: string
		account_number?: string
		sequence?: string
		base_account?: {
			address?: string
			account_number?: string
			sequence?: string
		}
		base_vesting_account?: {
			base_account?: {
				address?: string
				account_number?: string
				sequence?: string
			}
		}
	} | undefined,
	timestampMs: number
) => {
	const accountBaseFields = account == null ? undefined : cosmosAccountBaseFields(account)
	return {
	[EntityMetaKey.Selector]: {
		$account: accountId,
		timestampMs,
		source: Source.CosmosSdk_Rest,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], '$account')]: {
			[EntityMetaKey.Selector]: accountId,
		},
	},
	timestampMs,
	source: Source.CosmosSdk_Rest,
	...(accountBaseFields?.account_number != null && {
		accountNumber: BigInt(accountBaseFields.account_number),
	}),
	...(accountBaseFields?.sequence != null && {
		sequence: BigInt(accountBaseFields.sequence),
	}),
	}
}

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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.CosmosValidator_Timestamp, [], '$validator')]: {
			[EntityMetaKey.Selector]: validatorId,
		},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.CosmosGovernanceProposal_Timestamp, [], 'status')]: proposal.status,
	},
})

const cosmosProposalTimestampReference = (
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.CosmosGovernanceProposal_Timestamp, [], 'status')]: proposal.status,
	},
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
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.CosmosMessage, [], 'typeUrl')]: message['@type'] ?? 'unknown',
			...((message.signer ?? message.sender) != null && {
				[entityFieldAddressKey(EntityType.CosmosMessage, [], '$signer')]: {
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						address: (message.signer ?? message.sender) ?? '',
					},
				},
			}),
			...(message.contract != null && {
				[entityFieldAddressKey(EntityType.CosmosMessage, [], '$contract')]: {
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						address: message.contract,
					},
				},
			}),
		},
	}))
)

export default {
	source: Source.CosmosSdk_Rest,

	resolvers: [
		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async () => [
						{
							url: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							transportType: TransportType.Http,
							providerName: 'Cosmos Directory',
						},
					],
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async () => [
						{
							url: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							transportType: TransportType.Http,
							providerName: 'Cosmos Directory',
						},
					],
				}
			},
		})({
				Cosmos: {
					restEndpoints: (restEndpoints) => restEndpoints,
				},
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network_Timestamp,
			resolve: {
				[Network_TimestampSelector.NetworkTimestampMsSource]: {
					appliesTo: cosmosNetworkTimestampApplicability,
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						const {
							getLatestBlock,
							getNodeInfo,
							getStakingPool,
							getSyncing,
							getValidators,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [
							latestBlock,
							nodeInfo,
							syncing,
							bondedValidators,
							stakingPool,
						] = await Promise.all([
							getLatestBlock({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
							getNodeInfo({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
							getSyncing({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
							getValidators({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								limit: 1,
								status: 'BOND_STATUS_BONDED',
							}),
							getStakingPool({ restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl }),
						])
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [NetworkLedgerModel.Account],
							executionModels: [NetworkExecutionModel.CosmosSdk],
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
							bondedValidatorCount: cosmosPaginationCount(bondedValidators.pagination?.total, 'bonded validator'),
							bondedTokens: BigInt(stakingPool.pool.bonded_tokens),
							notBondedTokens: BigInt(stakingPool.pool.not_bonded_tokens),
						}
					},
				}
			},
		})({
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				ledgerModels: (timestamp) => timestamp.ledgerModels,
				executionModels: (timestamp) => timestamp.executionModels,
				Cosmos: {
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
					bondedValidatorCount: (timestamp) => timestamp.bondedValidatorCount,
					bondedTokens: (timestamp) => timestamp.bondedTokens,
					notBondedTokens: (timestamp) => timestamp.notBondedTokens,
				},
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosBlock,
			resolve: {
				[CosmosBlockSelector.NetworkHeight]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({ $network, height }) => {

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
					},
				}
			},
		})({
				hash: (block) => block.hash,
				proposerConsensusAddress: (block) => block.proposerConsensusAddress,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosTransaction,
			resolve: {
				[CosmosTransactionSelector.NetworkTxHash]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
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
					},
				}
			},
		})({
				$block: (transaction) => transaction.$block,
				code: (transaction) => transaction.code,
				gasWanted: (transaction) => transaction.gasWanted,
				gasUsed: (transaction) => transaction.gasUsed,
				memo: (transaction) => transaction.memo,
				$$messages: (transaction) => transaction.$$messages,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosAccount,
			resolve: {
				[CosmosAccountSelector.NetworkAddress]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const { $network, address } = entitySelector
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
					},
				}
			},
		})({
				$$timestamps: (account) => account.$$timestamps,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosAccount_Timestamp,
			resolve: {
				[CosmosAccount_TimestampSelector.AccountTimestampMsSource]: {
					appliesTo: cosmosAccountTimestampApplicability,
					resolve: async ({
						$account,
						timestampMs,
						source,
					}) => {
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
			},
		})({
				$account: (account) => account.$account,
				timestampMs: (account) => account.timestampMs,
				source: (account) => account.source,
				accountNumber: (account) => account.accountNumber,
				sequence: (account) => account.sequence,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosValidator,
			resolve: {
				[CosmosValidatorSelector.NetworkOperatorAddress]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const { $network, operatorAddress } = entitySelector
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
					},
				}
			},
		})({
				consensusPubkey: (validator) => validator.consensusPubkey,
				moniker: (validator) => validator.moniker,
				$$timestamps: (validator) => validator.$$timestamps,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosValidator_Timestamp,
			resolve: {
				[CosmosValidator_TimestampSelector.ValidatorTimestampMsSource]: {
					appliesTo: cosmosValidatorTimestampApplicability,
					resolve: async ({
						$validator,
						timestampMs,
						source,
					}) => {
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
			},
		})({
				$validator: (validator) => validator.$validator,
				timestampMs: (validator) => validator.timestampMs,
				source: (validator) => validator.source,
				jailed: (validator) => validator.jailed,
				status: (validator) => validator.status,
				tokens: (validator) => validator.tokens,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosMessage,
			resolve: {
				[CosmosMessageSelector.TransactionIndexInTransaction]: {
					appliesTo: cosmosTransactionReferenceApplicability,
					resolve: async ({ $transaction, indexInTransaction }) => {
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
					},
				}
			},
		})({
				typeUrl: (message) => message.typeUrl,
				$signer: (message) => message.$signer,
				$contract: (message) => message.$contract,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosGovernanceProposal,
			resolve: {
				[CosmosGovernanceProposalSelector.NetworkProposalId]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const { $network, proposalId } = entitySelector
						const { getProposal } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const proposal = (await getProposal({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							proposalId: proposalId,
						})).proposal
						return {
							title: proposal.title ?? proposal.messages?.[0]?.content?.title,
							summary: proposal.summary ?? proposal.messages?.[0]?.content?.description,
							$$timestamps: [
								cosmosProposalTimestampReference(entitySelector, proposal, Date.now()),
							],
						}
					},
				}
			},
		})({
				title: (proposal) => proposal.title,
				summary: (proposal) => proposal.summary,
				$$timestamps: (proposal) => proposal.$$timestamps,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosGovernanceProposal_Timestamp,
			resolve: {
				[CosmosGovernanceProposal_TimestampSelector.ProposalTimestampMsSource]: {
					appliesTo: cosmosProposalTimestampApplicability,
					resolve: async ({
						$proposal,
						timestampMs,
						source,
					}) => {
						const { getProposal } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return {
							$proposal: {
								[EntityMetaKey.Selector]: $proposal,
							},
							timestampMs,
							source,
							status: (await getProposal({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								proposalId: $proposal.proposalId,
							})).proposal.status,
						}
					},
				},
			},
		})({
				$proposal: (proposal) => proposal.$proposal,
				timestampMs: (proposal) => proposal.timestampMs,
				source: (proposal) => proposal.source,
				status: (proposal) => proposal.status,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosDenom,
			resolve: {
				[CosmosDenomSelector.NetworkDenom]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({ $network, denom }) => {
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
					},
				}
			},
		})({
				display: (denom) => denom.display,
				base: (denom) => denom.base,
				symbol: (denom) => denom.symbol,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosModule,
			resolve: {
				[CosmosModuleSelector.NetworkModuleName]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({ $network, moduleName }) => {
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
					},
				}
			},
		})({
				$authority: (module) => module.$authority,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosContract,
			resolve: {
				[CosmosContractSelector.NetworkAddress]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => {
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
					},
				}
			},
		})({
				codeId: (contract) => contract.codeId,
				$creator: (contract) => contract.$creator,
				$admin: (contract) => contract.$admin,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async (network) => {
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									timestampMs: Date.now(),
									source: Source.CosmosSdk_Rest,
								},
							},
						]
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async (network) => {
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									timestampMs: Date.now(),
									source: Source.CosmosSdk_Rest,
								},
							},
						]
					},
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async (network, context) => {
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
								$network: network,
								height: latestBlockHeight - BigInt(blockOffset),
							},
						}))
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async (network, context) => {
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
								$network: network,
								height: latestBlockHeight - BigInt(blockOffset),
							},
						}))
					},
				}
			},
		})({
				Cosmos: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async (network, context) => {
						const { getAccounts } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosAccountRows(
							network,
							(await getAccounts({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								limit: resolverContextRowLimit(context),
							})).accounts
						).map((account) => ({
							[EntityMetaKey.Selector]: account[EntityMetaKey.Selector],
						}))
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async (network, context) => {
						const { getAccounts } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosAccountRows(
							network,
							(await getAccounts({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								limit: resolverContextRowLimit(context),
							})).accounts
						).map((account) => ({
							[EntityMetaKey.Selector]: account[EntityMetaKey.Selector],
						}))
					},
				}
			},
		})({
				Cosmos: {
					$$accounts: (accounts) => accounts,
				},
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async () => {
						const { getAccounts } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosPaginationCount((await getAccounts({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							limit: 1,
						})).pagination?.total, 'account')
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async () => {
						const { getAccounts } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosPaginationCount((await getAccounts({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							limit: 1,
						})).pagination?.total, 'account')
					},
				}
			},
		})({
				Cosmos: {
					$$accounts: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async (network, context) => {
						const { getValidators } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosValidatorRows(
							network,
							(await getValidators({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								limit: resolverContextRowLimit(context),
							})).validators
						).map((validator) => ({
							[EntityMetaKey.Selector]: validator[EntityMetaKey.Selector],
						}))
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async (network, context) => {
						const { getValidators } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosValidatorRows(
							network,
							(await getValidators({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								limit: resolverContextRowLimit(context),
							})).validators
						).map((validator) => ({
							[EntityMetaKey.Selector]: validator[EntityMetaKey.Selector],
						}))
					},
				}
			},
		})({
				Cosmos: {
					$$validators: (validators) => validators,
				},
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async (network) => {
						const { getValidators } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosPaginationCount((await getValidators({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							limit: 1,
						})).pagination?.total, 'validator')
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async (network) => {
						const { getValidators } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosPaginationCount((await getValidators({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							limit: 1,
						})).pagination?.total, 'validator')
					},
				}
			},
		})({
				Cosmos: {
					$$validators: {
						resolveCount: (count) => count,
					},
				},
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async (network, context) => {
						const { getProposals } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosProposalRows(
							network,
							(await getProposals({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								limit: resolverContextRowLimit(context),
							})).proposals
						).map((proposal) => ({
							[EntityMetaKey.Selector]: proposal[EntityMetaKey.Selector],
						}))
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async (network, context) => {
						const { getProposals } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosProposalRows(
							network,
							(await getProposals({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								limit: resolverContextRowLimit(context),
							})).proposals
						).map((proposal) => ({
							[EntityMetaKey.Selector]: proposal[EntityMetaKey.Selector],
						}))
					},
				}
			},
		})({
				Cosmos: {
					$$governanceProposals: (proposals) => proposals,
				},
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async (network) => {
						const { getProposals } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosPaginationCount((await getProposals({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							limit: 1,
						})).pagination?.total, 'governance proposal')
					},
				},
				[NetworkSelector.Slug]: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async (network) => {
						const { getProposals } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosPaginationCount((await getProposals({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							limit: 1,
						})).pagination?.total, 'governance proposal')
					},
				}
			},
		})({
				Cosmos: {
					$$governanceProposals: {
						resolveCount: (count) => count,
					},
				},
			}),


		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosTransaction,
			resolve: {
				[CosmosTransactionSelector.NetworkTxHash]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						return cosmosMessageRows(
							entitySelector,
							await getTx({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								txHash: entitySelector.txHash,
							})
						)
					},
				}
			},
		})({
				$$messages: (messages) => messages,
			}),
	],
}
