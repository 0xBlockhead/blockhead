import {
	NetworkExecutionModel,
	NetworkLedgerModel,
	networkBySlug,
} from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	MintscanAccount,
	MintscanTxResponse,
} from '$/sources/Mintscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertCosmosHub = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.cosmos.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cosmos.caip2.namespace
			&& network.caip2.reference === networkBySlug.cosmos.caip2.reference
		)
	)
		return

	throw new Error('Mintscan: unsupported network')
}

const cosmosNetworkApplicability = [
	{
		caip2: networkBySlug.cosmos.caip2,
	},
	{
		slug: networkBySlug.cosmos.slug,
	},
] as const

const cosmosNetworkResolverSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId
	) => Promise<_Snapshot> | _Snapshot
) => ({
	Caip2: {
		appliesTo: [cosmosNetworkApplicability[0]],
		resolve,
	},
	Slug: {
		appliesTo: [cosmosNetworkApplicability[1]],
		resolve,
	},
})

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
		$network: cosmosNetworkApplicability[0],
		source: Source.Mintscan,
	},
	{
		$network: cosmosNetworkApplicability[1],
		source: Source.Mintscan,
	},
] as const

const cosmosAccountTimestampApplicability = [
	{
		$account: cosmosNetworkReferenceApplicability[0],
		source: Source.Mintscan,
	},
	{
		$account: cosmosNetworkReferenceApplicability[1],
		source: Source.Mintscan,
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

const accountBaseFields = (
	account: MintscanAccount
) => (
	account.base_account
	?? account.base_vesting_account?.base_account
	?? account
)

const assertAccountNumber = (accountNumber: string | undefined) => {
	if (
		accountNumber != null
		&& !/^(0|[1-9]\d*)$/.test(accountNumber)
	)
		throw new Error('Mintscan: invalid account number')
}

const assertAccountSequence = (sequence: string | undefined) => {
	if (
		sequence != null
		&& !/^(0|[1-9]\d*)$/.test(sequence)
	)
		throw new Error('Mintscan: invalid account sequence')
}

const cosmosUnsignedInteger = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9]\d*)$/.test(value))
		throw new Error(`Mintscan: invalid ${label}`)
	return BigInt(value)
}

const cosmosAccountTimestampFields = (
	accountSelector: EntitySelector<typeof schema, EntityType.CosmosAccount>,
	account: MintscanAccount,
	timestampMs: number
) => {
	const baseAccount = accountBaseFields(account)
	if (baseAccount.address !== accountSelector.address)
		throw new Error('Mintscan: account response does not match the subject')

	assertAccountNumber(baseAccount.account_number)
	assertAccountSequence(baseAccount.sequence)

	return {
		$account: {
			[EntityMetaKey.Selector]: accountSelector,
		},
		timestampMs,
		source: Source.Mintscan,
		...(baseAccount.account_number != null && {
			accountNumber: BigInt(baseAccount.account_number),
		}),
		...(baseAccount.sequence != null && {
			sequence: BigInt(baseAccount.sequence),
		}),
	}
}

const cosmosMessageFields = (
	network: NetworkId,
	message: NonNullable<NonNullable<NonNullable<MintscanTxResponse['tx']>['body']>['messages']>[number]
) => {
	const signerAddress = message.signer ?? message.sender ?? message.from_address
	return {
		typeUrl: message['@type'] ?? 'unknown',
		...(signerAddress != null && {
			$signer: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: signerAddress,
				},
			},
		}),
		...(message.contract != null && {
			$contract: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: message.contract,
				},
			},
		}),
	}
}

const cosmosMessageRows = (
	entitySelector: {
		$network: NetworkId
		txHash: string
	},
	wireTransaction: MintscanTxResponse
) => (
	(wireTransaction.tx?.body?.messages ?? []).map((message, indexInTransaction) => {
		const fields = cosmosMessageFields(entitySelector.$network, message)
		return {
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CosmosMessage, [], 'typeUrl')]: fields.typeUrl,
				...(fields.$signer != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], '$signer')]: fields.$signer,
				}),
				...(fields.$contract != null && {
					[entityFieldAddressKey(EntityType.CosmosMessage, [], '$contract')]: fields.$contract,
				}),
			},
		}
	})
)

const cosmosTransactionFields = (
	entitySelector: {
		$network: NetworkId
		txHash: string
	},
	wireTransaction: MintscanTxResponse
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

const getCosmosBlockReferences = async (
	network: NetworkId,
	limit: number,
	publicEnv: SourcePublicEnv
) => {
	assertCosmosHub(network)
	const { getLatestBlock } = await import('$/sources/Mintscan/Rest/queries.ts')
	const latestBlock = await getLatestBlock(publicEnv, {
		network: networkBySlug.cosmos.slug,
	})
	const latestBlockHeight = BigInt(latestBlock.block.header.height)
	const tipTimestampMs = Date.parse(latestBlock.block.header.time)
	if (!Number.isSafeInteger(tipTimestampMs) || tipTimestampMs < 0)
		throw new Error('Mintscan: latest block has an invalid timestamp')

	return Array.from({
		length: Math.min(
			Number(latestBlockHeight + 1n),
			limit
		),
	}, (_value, blockOffset) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			height: latestBlockHeight - BigInt(blockOffset),
		},
		...(blockOffset === 0 && {
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CosmosBlock, [], 'hash')]: latestBlock.block_id.hash,
				[entityFieldAddressKey(EntityType.CosmosBlock, [], 'proposerConsensusAddress')]: latestBlock.block.header.proposer_address,
				[entityFieldAddressKey(EntityType.CosmosBlock, [], 'timestampMs')]: tipTimestampMs,
				[entityFieldAddressKey(EntityType.CosmosBlock, [], 'transactionCount')]: latestBlock.block.data.txs?.length ?? 0,
			},
		}),
	}))
}

export default {
	source: Source.Mintscan,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(
				async (network) => ([
					{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs: Date.now(),
							source: Source.Mintscan,
						},
					},
				])
			),
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [cosmosNetworkApplicability[0]],
					resolve: async (network, context) => (
						getCosmosBlockReferences(
							network,
							resolverContextRowLimit(context),
							context.publicEnv
						)
					),
				},
				Slug: {
					appliesTo: [cosmosNetworkApplicability[1]],
					resolve: async (network, context) => (
						getCosmosBlockReferences(
							network,
							resolverContextRowLimit(context),
							context.publicEnv
						)
					),
				},
			},
		})({
			Cosmos: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: [
						...cosmosNetworkTimestampApplicability,
					],
					resolve: async ({
						$network,
						timestampMs,
						source,
					}, context) => {
						assertCosmosHub($network)
						if (source !== Source.Mintscan)
							throw new Error(`Mintscan: unsupported network timestamp source ${source}`)

						const {
							getLatestBlock,
							getNodeInfo,
							getSyncing,
						} = await import('$/sources/Mintscan/Rest/queries.ts')
						const [
							latestBlock,
							nodeInfo,
							syncing,
						] = await Promise.all([
							getLatestBlock(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
							}),
							getNodeInfo(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
							}),
							getSyncing(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
							}),
						])

						const latestBlockTimeMs = Date.parse(latestBlock.block.header.time)
						if (!Number.isSafeInteger(latestBlockTimeMs) || latestBlockTimeMs < 0)
							throw new Error('Mintscan: latest block has an invalid timestamp')

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
							latestBlockTimeMs,
							latestBlockTransactionCount: latestBlock.block.data.txs?.length ?? 0,
							chainId: nodeInfo.default_node_info.network,
							nodeNetwork: nodeInfo.default_node_info.network,
							applicationName: nodeInfo.application_version?.app_name ?? nodeInfo.application_version?.name,
							applicationVersion: nodeInfo.application_version?.version,
							cosmosSdkVersion: nodeInfo.application_version?.cosmos_sdk_version,
							isSyncing: syncing.syncing,
						}
					},
				},
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
			},
		}),

		defineResolver({
			entityType: EntityType.CosmosAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: [
						...cosmosNetworkReferenceApplicability,
					],
					resolve: async (accountSelector, context) => {
						assertCosmosHub(accountSelector.$network)

						const {
							getAccount,
							getLatestBlock,
						} = await import('$/sources/Mintscan/Rest/queries.ts')
						const [
							{ account },
							latestBlock,
						] = await Promise.all([
							getAccount(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
								address: accountSelector.address,
							}),
							getLatestBlock(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
							}),
						])

						const timestampMs = Date.parse(latestBlock.block.header.time)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('Mintscan: latest block has an invalid timestamp')

						const timestamp = cosmosAccountTimestampFields(
							accountSelector,
							account,
							timestampMs
						)
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$account: accountSelector,
									timestampMs: timestamp.timestampMs,
									source: timestamp.source,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], '$account')]: timestamp.$account,
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
				},
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CosmosAccount_Timestamp,
			resolve: {
				AccountTimestampMsSource: {
					appliesTo: [
						...cosmosAccountTimestampApplicability,
					],
					resolve: async ({
						$account,
						timestampMs,
						source,
					}, context) => {
						assertCosmosHub($account.$network)
						if (source !== Source.Mintscan)
							throw new Error(`Mintscan: unsupported account timestamp source ${source}`)

						const { getAccount } = await import('$/sources/Mintscan/Rest/queries.ts')
						const { account } = await getAccount(context.publicEnv, {
							network: networkBySlug.cosmos.slug,
							address: $account.address,
						})
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

		defineResolver({
			entityType: EntityType.CosmosBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: [
						...cosmosNetworkReferenceApplicability,
					],
					resolve: async ({
						$network,
						height,
					}, context) => {
						assertCosmosHub($network)

						const { getBlock } = await import('$/sources/Mintscan/Rest/queries.ts')
						const wireBlock = await getBlock(context.publicEnv, {
							network: networkBySlug.cosmos.slug,
							height,
						})
						if (BigInt(wireBlock.block.header.height) !== height)
							throw new Error('Mintscan: block response does not match the subject height')

						const timestampMs = Date.parse(wireBlock.block.header.time)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('Mintscan: block has an invalid timestamp')

						return {
							hash: wireBlock.block_id.hash,
							proposerConsensusAddress: wireBlock.block.header.proposer_address,
							timestampMs,
							transactionCount: wireBlock.block.data.txs?.length ?? 0,
						}
					},
				},
			},
		})({
			hash: (block) => block.hash,
			proposerConsensusAddress: (block) => block.proposerConsensusAddress,
			timestampMs: (block) => block.timestampMs,
			transactionCount: (block) => block.transactionCount,
		}),

		defineResolver({
			entityType: EntityType.CosmosTransaction,
			resolve: {
				NetworkTxHash: {
					appliesTo: [
						...cosmosNetworkReferenceApplicability,
					],
					resolve: async (entitySelector, context) => {
						assertCosmosHub(entitySelector.$network)

						const { getTx } = await import('$/sources/Mintscan/Rest/queries.ts')
						const wireTransaction = await getTx(context.publicEnv, {
							network: networkBySlug.cosmos.slug,
							txHash: entitySelector.txHash,
						})
						if (wireTransaction.tx_response.txhash !== entitySelector.txHash)
							throw new Error('Mintscan: transaction response does not match the subject')

						return cosmosTransactionFields(entitySelector, wireTransaction)
					},
				},
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

		defineResolver({
			entityType: EntityType.CosmosMessage,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: [
						...cosmosTransactionReferenceApplicability,
					],
					resolve: async ({
						$transaction,
						indexInTransaction,
					}, context) => {
						assertCosmosHub($transaction.$network)

						const { getTx } = await import('$/sources/Mintscan/Rest/queries.ts')
						const message = (
							await getTx(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
								txHash: $transaction.txHash,
							})
						).tx?.body?.messages?.at(indexInTransaction)
						if (message == null)
							throw new Error(`Mintscan: message not found for ${$transaction.txHash}:${indexInTransaction}`)

						return cosmosMessageFields($transaction.$network, message)
					},
				},
			},
		})({
			typeUrl: (message) => message.typeUrl,
			$signer: (message) => message.$signer,
			$contract: (message) => message.$contract,
		}),
	],
} satisfies RegisteredSourceResolverModule
