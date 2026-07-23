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
	CosmosSdkTxsEventResponse,
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

const assertCosmosHub = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === cosmosNetworkBySlug.cosmos.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === cosmosNetworkBySlug.cosmos.caip2.namespace
			&& network.caip2.reference === cosmosNetworkBySlug.cosmos.caip2.reference
		)
	)
		return

	throw new Error('CosmosSdk_Rest: unsupported network')
}

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

const cosmosUnsignedInteger = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9]\d*)$/.test(value))
		throw new Error(`CosmosSdk_Rest: invalid ${label} ${value}`)

	return BigInt(value)
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
		title: string
		status: string
	}[]
) => (
	proposals.map((proposal) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			proposalId: proposal.id,
		},
		title: proposal.title,
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
			...((message.signer ?? message.sender ?? message.from_address) != null && {
				[entityFieldAddressKey(EntityType.CosmosMessage, [], '$signer')]: {
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						address: (message.signer ?? message.sender ?? message.from_address) ?? '',
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

const cosmosTransactionFields = (
	entitySelector: {
		$network: NetworkId
		txHash: string
	},
	wireTransaction: CosmosSdkTxResponse
) => ({
	$block: {
		[EntityMetaKey.Selector]: {
			$network: entitySelector.$network,
			height: cosmosUnsignedInteger(wireTransaction.tx_response.height, 'transaction height'),
		},
	},
	code: wireTransaction.tx_response.code,
	...(wireTransaction.tx_response.codespace != null && {
		codespace: wireTransaction.tx_response.codespace,
	}),
	gasWanted: cosmosUnsignedInteger(wireTransaction.tx_response.gas_wanted, 'gas wanted'),
	gasUsed: cosmosUnsignedInteger(wireTransaction.tx_response.gas_used, 'gas used'),
	feeAmount: (wireTransaction.tx?.auth_info?.fee?.amount ?? []).map((amount) => ({
		denom: amount.denom,
		amount: cosmosUnsignedInteger(amount.amount, 'fee amount'),
	})),
	...(wireTransaction.tx?.auth_info?.fee?.gas_limit != null && {
		feeGasLimit: cosmosUnsignedInteger(wireTransaction.tx.auth_info.fee.gas_limit, 'fee gas limit'),
	}),
	...(wireTransaction.tx?.body?.memo != null && {
		memo: wireTransaction.tx.body.memo,
	}),
	...(wireTransaction.tx?.body?.timeout_height != null && {
		timeoutHeight: cosmosUnsignedInteger(wireTransaction.tx.body.timeout_height, 'timeout height'),
	}),
	signerAddresses: [...new Set(
		(wireTransaction.tx?.body?.messages ?? []).flatMap((message) => (
			(message.signer ?? message.sender ?? message.from_address) == null ?
				[]
			:
				[(message.signer ?? message.sender ?? message.from_address) ?? '']
		))
	)],
	signatures: wireTransaction.tx?.signatures ?? [],
	rawLog: wireTransaction.tx_response.raw_log,
	eventTypes: [...new Set(
		(wireTransaction.tx_response.events ?? []).map((event) => event.type)
	)],
	$$messages: cosmosMessageRows(entitySelector, wireTransaction),
})

const cosmosTransactionSearchResults = (
	response: CosmosSdkTxsEventResponse
) => {
	if (response.txs.length !== response.tx_responses.length)
		throw new Error('CosmosSdk_Rest: transaction search response arrays do not align')

	const total = Number(cosmosUnsignedInteger(response.total, 'transaction search total'))
	if (!Number.isSafeInteger(total) || total < 0)
		throw new Error(`CosmosSdk_Rest: invalid transaction search total ${response.total}`)

	const transactionHashes = new Set(response.tx_responses.map((transaction) => transaction.txhash))
	if (transactionHashes.size !== response.tx_responses.length || transactionHashes.has(''))
		throw new Error('CosmosSdk_Rest: transaction search response contains invalid duplicate identities')

	return {
		total,
		transactions: response.tx_responses.map((txResponse, index) => ({
			tx: response.txs[index],
			tx_response: txResponse,
		})),
	}
}

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
						assertCosmosHub(entitySelector.$network)

						const { getTx } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const wireTransaction = await getTx({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							txHash: entitySelector.txHash,
						})
						if (wireTransaction.tx_response.txhash !== entitySelector.txHash)
							throw new Error('CosmosSdk_Rest: transaction response does not match the subject')

						return cosmosTransactionFields(entitySelector, wireTransaction)
					},
				}
			},
		})({
				$block: (transaction) => transaction.$block,
				code: (transaction) => transaction.code,
				codespace: (transaction) => transaction.codespace,
				gasWanted: (transaction) => transaction.gasWanted,
				gasUsed: (transaction) => transaction.gasUsed,
				feeAmount: (transaction) => transaction.feeAmount,
				feeGasLimit: (transaction) => transaction.feeGasLimit,
				memo: (transaction) => transaction.memo,
				timeoutHeight: (transaction) => transaction.timeoutHeight,
				signerAddresses: (transaction) => transaction.signerAddresses,
				signatures: (transaction) => transaction.signatures,
				rawLog: (transaction) => transaction.rawLog,
				eventTypes: (transaction) => transaction.eventTypes,
				$$messages: (transaction) => transaction.$$messages,
			}),

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosAccount,
			resolve: {
				[CosmosAccountSelector.NetworkAddress]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const { $network, address } = entitySelector
						assertCosmosHub($network)

						const {
							getAccount,
							getLatestBlock,
						} = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [
							{ account },
							latestBlock,
						] = await Promise.all([
							getAccount({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								address: address,
							}),
							getLatestBlock({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							}),
						])
						if (account == null)
							throw new Error('CosmosSdk_Rest: account response is missing')

						if (cosmosAccountBaseFields(account).address !== address)
							throw new Error('CosmosSdk_Rest: account response does not match the subject')

						const timestampMs = Date.parse(latestBlock.block.header.time)
						if (!Number.isFinite(timestampMs))
							throw new Error('CosmosSdk_Rest: latest block has an invalid timestamp')

						const timestamp = cosmosAccountTimestampFields(entitySelector, account, timestampMs)
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
								[EntityMetaKey.Fields]: {
									...(timestamp.accountNumber != null && {
										[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'accountNumber')]: timestamp.accountNumber,
									}),
									...(timestamp.sequence != null && {
										[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'sequence')]: timestamp.sequence,
									}),
								},
							}],
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
						assertCosmosHub($account.$network)
						if (source !== Source.CosmosSdk_Rest)
							throw new Error(`CosmosSdk_Rest: unsupported account timestamp source ${source}`)

						const { getAccount } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const account = (await getAccount({
							restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
							address: $account.address,
						})).account
						if (account == null)
							throw new Error('CosmosSdk_Rest: account response is missing')

						if (cosmosAccountBaseFields(account).address !== $account.address)
							throw new Error('CosmosSdk_Rest: account response does not match the subject')

						return cosmosAccountTimestampFields(
							$account,
							account,
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
						if (proposal.id !== proposalId)
							throw new Error('CosmosSdk_Rest: governance proposal response does not match the subject')

						return {
							title: proposal.title,
							summary: proposal.summary,
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

		defineResolver(Source.CosmosSdk_Rest, {
			entityType: EntityType.CosmosAccount,
			resolve: {
				[CosmosAccountSelector.NetworkAddress]: {
					appliesTo: cosmosNetworkReferenceApplicability,
					resolve: async (cosmosAccount, context) => {
						assertCosmosHub(cosmosAccount.$network)
						const limit = resolverContextRowLimit(context)
						const offset = context.providerContinuationToken == null ?
							context.pagination.offset ?? 0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('CosmosSdk_Rest: invalid account transaction continuation')

						const prefixLimit = offset + limit
						if (!Number.isSafeInteger(prefixLimit) || prefixLimit < 1)
							throw new Error('CosmosSdk_Rest: invalid account transaction limit')

						const { getTransactionsByEvent } = await import('$/sources/CosmosSdk/Rest/queries.ts')
						const [senderPage, recipientPage] = await Promise.all([
							getTransactionsByEvent({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								event: `message.sender='${cosmosAccount.address}'`,
								limit: prefixLimit,
							}),
							getTransactionsByEvent({
								restBaseUrl: cosmosNetworkBySlug.cosmos.cosmosSdkRestBaseUrl,
								event: `transfer.recipient='${cosmosAccount.address}'`,
								limit: prefixLimit,
							}),
						])
						const senderResults = cosmosTransactionSearchResults(senderPage)
						const recipientResults = cosmosTransactionSearchResults(recipientPage)
						const transactionByHash = new Map<string, CosmosSdkTxResponse>()
						for (const transaction of [
							...senderResults.transactions,
							...recipientResults.transactions,
						])
							if (!transactionByHash.has(transaction.tx_response.txhash))
								transactionByHash.set(transaction.tx_response.txhash, transaction)

						const transactions = [...transactionByHash.values()].toSorted((left, right) => {
							const leftHeight = cosmosUnsignedInteger(left.tx_response.height, 'transaction height')
							const rightHeight = cosmosUnsignedInteger(right.tx_response.height, 'transaction height')
							if (leftHeight !== rightHeight)
								return leftHeight < rightHeight ? 1 : -1

							return left.tx_response.txhash.localeCompare(right.tx_response.txhash)
						})
						return {
							limit,
							offset,
							terminal: (
								senderResults.total <= senderResults.transactions.length
								&& recipientResults.total <= recipientResults.transactions.length
								&& transactions.length <= prefixLimit
							),
							transactions: transactions.slice(offset, prefixLimit),
						}
					},
				},
			},
		})({
				$$transactions: {
					select: (page, cosmosAccount) => page.transactions.map((wireTransaction) => {
						const transactionSelector = {
							$network: cosmosAccount.$network,
							txHash: wireTransaction.tx_response.txhash,
						}
						const transaction = cosmosTransactionFields(
							transactionSelector,
							wireTransaction
						)
						return {
							[EntityMetaKey.Selector]: transactionSelector,
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'txHash')]: transactionSelector.txHash,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], '$block')]: transaction.$block,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'code')]: transaction.code,
								...(transaction.codespace != null && {
									[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'codespace')]: transaction.codespace,
								}),
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'gasWanted')]: transaction.gasWanted,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'gasUsed')]: transaction.gasUsed,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'feeAmount')]: transaction.feeAmount,
								...(transaction.feeGasLimit != null && {
									[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'feeGasLimit')]: transaction.feeGasLimit,
								}),
								...(transaction.memo != null && {
									[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'memo')]: transaction.memo,
								}),
								...(transaction.timeoutHeight != null && {
									[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'timeoutHeight')]: transaction.timeoutHeight,
								}),
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'signerAddresses')]: transaction.signerAddresses,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'signatures')]: transaction.signatures,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'rawLog')]: transaction.rawLog,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], 'eventTypes')]: transaction.eventTypes,
								[entityFieldAddressKey(EntityType.CosmosTransaction, [], '$$messages')]: transaction.$$messages,
							},
						}
					}),
					continuation: (page, cosmosAccount) => (
						page.terminal ?
							{
								operation: 'account-transactions',
								target: cosmosAccount.address,
								terminal: true,
							}
						:
							{
								operation: 'account-transactions',
								target: cosmosAccount.address,
								terminal: false,
								token: (page.offset + page.limit).toString(),
							}
					),
				},
			}),
	],
}
