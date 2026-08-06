import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	type EntitySelector,
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type NetworkSelector = EntitySelector<typeof schema, EntityType.Network>
type SuiNetworkSelector = EntitySelector<typeof schema, EntityType.SuiNetwork>

const assertSuiNetwork = ($network: NetworkSelector) => {
	if (!('slug' in $network) || $network.slug !== networkBySlug.sui.slug)
		throw new Error('Sui: unsupported network')
}

const assertSuiNetworkEntity = ($network: SuiNetworkSelector) => {
	assertSuiNetwork($network.$network)
}

const assertSource = (source: string) => {
	if (source !== Source.Sui)
		throw new Error('Sui: observation source mismatch')
}

const suiNetworkApplicability = [
	{
		$network: {
			slug: networkBySlug.sui.slug,
		},
	},
] as const

const suiNetworkTimestampApplicability = [
	{
		$network: suiNetworkApplicability[0],
		source: Source.Sui,
	},
] as const

const suiCheckpointSequenceApplicability = suiNetworkApplicability
const suiCheckpointDigestApplicability = suiNetworkApplicability

const suiTransactionApplicability = suiNetworkApplicability

const suiTransactionTimestampApplicability = [
	{
		$transaction: suiNetworkApplicability[0],
		source: Source.Sui,
	},
] as const

export default {
	source: Source.Sui,

	resolvers: [
		defineResolver({
			entityType: EntityType.SuiAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertSuiNetwork(account.$network.$network)
						const {
							getAddressBalances,
							normalizeSuiAddress,
						} = await import('$/sources/Sui/Graphql/queries.ts')
						const address = normalizeSuiAddress(account.address)

						return {
							address,
							page: await getAddressBalances({
								address,
								limit: Math.min(resolverContextRowLimit(context), 50),
								after: context.providerContinuationToken,
							}),
							timestampMs: Date.now(),
						}
					},
				},
			},
		})({
			$$balances: {
				select: ({
					address,
					page,
					timestampMs,
				}, account) => page.balances.map((balance) => ({
					[EntityMetaKey.Selector]: {
						$account: {
							$network: account.$network,
							address,
						},
						coinType: balance.coinType.repr,
						timestampMs,
						source: Source.Sui,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.SuiCoinBalance_Timestamp, [], 'totalBalance')]: BigInt(balance.totalBalance),
					},
				})),
				continuation: ({
					address,
					page,
				}) => (
					page.pagination.nextAfter == null ?
						{
							operation: 'account-balances',
							target: address,
							terminal: true,
						}
					:
						{
							operation: 'account-balances',
							target: address,
							terminal: false,
							token: page.pagination.nextAfter,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.SuiAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertSuiNetwork(account.$network.$network)
						const {
							getAddressTransactions,
							normalizeSuiAddress,
						} = await import('$/sources/Sui/Graphql/queries.ts')
						const address = normalizeSuiAddress(account.address)
						const page = await getAddressTransactions({
							address,
							limit: Math.min(resolverContextRowLimit(context), 50),
							after: context.providerContinuationToken,
						})

						return {
							address,
							page: {
								...page,
								transactions: page.transactions.map((transaction) => ({
									...transaction,
									...(transaction.sender != null && {
										sender: {
											address: normalizeSuiAddress(transaction.sender.address),
										},
									}),
								})),
							},
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ page }, account) => page.transactions.map((transaction) => ({
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						digest: transaction.digest,
					},
					...(transaction.sender != null && {
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.SuiTransaction, [], 'sender')]: transaction.sender.address,
						},
					}),
				})),
				continuation: ({
					address,
					page,
				}) => (
					page.pagination.nextAfter == null ?
						{
							operation: 'account-transactions',
							target: address,
							terminal: true,
						}
					:
						{
							operation: 'account-transactions',
							target: address,
							terminal: false,
							token: page.pagination.nextAfter,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.SuiNetwork,
			resolve: {
				Network: {
					appliesTo: suiNetworkApplicability,
					resolve: async ($network) => {
						assertSuiNetworkEntity($network)
						const { getLatestCheckpoint } = await import('$/sources/Sui/Graphql/queries.ts')
						const checkpoint = await getLatestCheckpoint()
						return {
							$network,
							checkpoint,
							timestampMs: checkpoint.timestampMs ?? Date.now(),
						}
					},
				},
			},
		})({
			$$timestamps: ({
				$network,
				checkpoint,
				timestampMs,
			}) => [{
				[EntityMetaKey.Selector]: {
					$network,
					timestampMs,
					source: Source.Sui,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'latestCheckpointSequence')]: checkpoint.sequence,
					[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'latestCheckpointDigest')]: checkpoint.digest,
					...(checkpoint.epoch != null && {
						[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'epoch')]: checkpoint.epoch,
					}),
					...(checkpoint.protocolVersion != null && {
						[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'protocolVersion')]: checkpoint.protocolVersion,
					}),
					...(checkpoint.totalTransactionCount != null && {
						[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'totalTransactionCount')]: checkpoint.totalTransactionCount,
					}),
				},
			}],
			$$checkpoints: ({
				$network,
				checkpoint,
			}) => [{
				[EntityMetaKey.Selector]: {
					$network,
					sequence: checkpoint.sequence,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'digest')]: checkpoint.digest,
					...(checkpoint.epoch != null && {
						[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'epoch')]: checkpoint.epoch,
					}),
					...(checkpoint.timestampMs != null && {
						[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'timestampMs')]: checkpoint.timestampMs,
					}),
					...(checkpoint.previousDigest != null && {
						[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'previousDigest')]: checkpoint.previousDigest,
					}),
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					appliesTo: [
						{
							slug: networkBySlug.sui.slug,
						},
					],
					resolve: async (network, context) => {
						assertSuiNetwork(network)
						const limit = Math.min(resolverContextRowLimit(context), 50)
						const {
							getCheckpointBySequence,
							getLatestCheckpoint,
						} = await import('$/sources/Sui/Graphql/queries.ts')
						const tip = await getLatestCheckpoint()
						const $network = {
							$network: network,
						} satisfies SuiNetworkSelector
						const timestampMs = tip.timestampMs ?? Date.now()
						const checkpoints = [
							tip,
							...await Promise.all(
								Array.from({
									length: Math.max(0, Math.min(Number(tip.sequence), limit) - 1),
								}, (_value, offset) => (
									getCheckpointBySequence(tip.sequence - BigInt(offset + 1))
								))
							),
						]
						return {
							$network,
							timestampMs,
							tip,
							checkpoints,
						}
					},
				},
			},
		})({
			Sui: {
				$$timestamps: ({
					$network,
					tip,
					timestampMs,
				}) => [{
					[EntityMetaKey.Selector]: {
						$network,
						timestampMs,
						source: Source.Sui,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'latestCheckpointSequence')]: tip.sequence,
						[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'latestCheckpointDigest')]: tip.digest,
						...(tip.epoch != null && {
							[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'epoch')]: tip.epoch,
						}),
						...(tip.protocolVersion != null && {
							[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'protocolVersion')]: tip.protocolVersion,
						}),
						...(tip.totalTransactionCount != null && {
							[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'totalTransactionCount')]: tip.totalTransactionCount,
						}),
					},
				}],
				$$checkpoints: ({
					$network,
					checkpoints,
				}) => checkpoints.map((checkpoint) => ({
					[EntityMetaKey.Selector]: {
						$network,
						sequence: checkpoint.sequence,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'digest')]: checkpoint.digest,
						...(checkpoint.epoch != null && {
							[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'epoch')]: checkpoint.epoch,
						}),
						...(checkpoint.timestampMs != null && {
							[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'timestampMs')]: checkpoint.timestampMs,
						}),
						...(checkpoint.previousDigest != null && {
							[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'previousDigest')]: checkpoint.previousDigest,
						}),
					},
				})),
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					appliesTo: [
						{
							slug: networkBySlug.sui.slug,
						},
					],
					resolve: async (network, context) => {
						assertSuiNetwork(network)
						const { getRecentTransactions } = await import('$/sources/Sui/Graphql/queries.ts')
						const page = await getRecentTransactions({
							limit: Math.min(resolverContextRowLimit(context), 50),
							after: context.providerContinuationToken,
						})
						const $network = {
							$network: network,
						} satisfies SuiNetworkSelector
						return {
							$network,
							page,
						}
					},
				},
			},
		})({
			Sui: {
				$$transactions: {
					select: ({
						$network,
						page,
					}) => page.transactions.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$network,
							digest: transaction.digest,
						},
						...(transaction.sender != null && {
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.SuiTransaction, [], 'sender')]: transaction.sender.address,
							},
						}),
					})),
					continuation: ({ page }) => (
						page.pagination.nextAfter == null ?
							{
								operation: 'network-transactions',
								terminal: true,
							}
						:
							{
								operation: 'network-transactions',
								terminal: false,
								token: page.pagination.nextAfter,
							}
					),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.SuiNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: suiNetworkTimestampApplicability,
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						assertSuiNetworkEntity($network)
						assertSource(source)
						const { getLatestCheckpoint } = await import('$/sources/Sui/Graphql/queries.ts')
						const checkpoint = await getLatestCheckpoint()
						return {
							timestampMs,
							latestCheckpointSequence: checkpoint.sequence,
							latestCheckpointDigest: checkpoint.digest,
							...(checkpoint.epoch != null && { epoch: checkpoint.epoch }),
							...(checkpoint.protocolVersion != null && { protocolVersion: checkpoint.protocolVersion }),
							...(checkpoint.totalTransactionCount != null && { totalTransactionCount: checkpoint.totalTransactionCount }),
						}
					},
				},
			},
		})({
			timestampMs: (snapshot) => snapshot.timestampMs,
			latestCheckpointSequence: (snapshot) => snapshot.latestCheckpointSequence,
			latestCheckpointDigest: (snapshot) => snapshot.latestCheckpointDigest,
			epoch: (snapshot) => snapshot.epoch,
			protocolVersion: (snapshot) => snapshot.protocolVersion,
			totalTransactionCount: (snapshot) => snapshot.totalTransactionCount,
		}),

		defineResolver({
			entityType: EntityType.SuiCheckpoint,
			resolve: {
				NetworkSequence: {
					appliesTo: suiCheckpointSequenceApplicability,
					resolve: async ({
						$network,
						sequence,
					}) => {
						assertSuiNetworkEntity($network)
						const { getCheckpointBySequence } = await import('$/sources/Sui/Graphql/queries.ts')
						return getCheckpointBySequence(sequence)
					},
				},
				NetworkDigest: {
					appliesTo: suiCheckpointDigestApplicability,
					resolve: async ({
						$network,
						digest,
					}) => {
						assertSuiNetworkEntity($network)
						const { getCheckpointByDigest } = await import('$/sources/Sui/Graphql/queries.ts')
						return getCheckpointByDigest(digest)
					},
				},
			},
		})({
			sequence: (checkpoint) => checkpoint.sequence,
			digest: (checkpoint) => checkpoint.digest,
			epoch: (checkpoint) => checkpoint.epoch,
			timestampMs: (checkpoint) => checkpoint.timestampMs,
			previousDigest: (checkpoint) => checkpoint.previousDigest,
		}),

		defineResolver({
			entityType: EntityType.SuiTransaction,
			resolve: {
				NetworkDigest: {
					appliesTo: suiTransactionApplicability,
					resolve: async ({
						$network,
						digest,
					}) => {
						assertSuiNetworkEntity($network)
						const { getTransaction } = await import('$/sources/Sui/Graphql/queries.ts')
						const transaction = await getTransaction(digest)
						return {
							$network,
							transaction,
						}
					},
				},
			},
		})({
			digest: ({ transaction }) => transaction.digest,
			sender: ({ transaction }) => transaction.sender,
			transactionKind: ({ transaction }) => transaction.transactionKind,
			$$timestamps: ({
				$network,
				transaction,
			}) => [{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network,
						digest: transaction.digest,
					},
					checkpointSequence: transaction.checkpointSequence,
					source: Source.Sui,
				},
				[EntityMetaKey.Fields]: {
					...(transaction.timestampMs != null && {
						[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'timestampMs')]: transaction.timestampMs,
					}),
					...(transaction.status != null && {
						[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'status')]: transaction.status,
					}),
					...(transaction.gasBudget != null && {
						[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'gasBudget')]: transaction.gasBudget,
					}),
					...(transaction.gasPrice != null && {
						[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'gasPrice')]: transaction.gasPrice,
					}),
					...(transaction.gasUsed != null && {
						[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'gasUsed')]: transaction.gasUsed,
					}),
					...(transaction.effectsDigest != null && {
						[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'effectsDigest')]: transaction.effectsDigest,
					}),
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.SuiTransaction_Timestamp,
			resolve: {
				TransactionCheckpointSequenceSource: {
					appliesTo: suiTransactionTimestampApplicability,
					resolve: async ({
						$transaction,
						checkpointSequence,
						source,
					}) => {
						assertSuiNetworkEntity($transaction.$network)
						assertSource(source)
						const { getTransaction } = await import('$/sources/Sui/Graphql/queries.ts')
						const transaction = await getTransaction($transaction.digest)
						if (transaction.checkpointSequence !== checkpointSequence)
							throw new Error('Sui: transaction checkpoint sequence mismatch')
						return transaction
					},
				},
			},
		})({
			checkpointSequence: (transaction) => transaction.checkpointSequence,
			timestampMs: (transaction) => transaction.timestampMs,
			status: (transaction) => transaction.status,
			gasBudget: (transaction) => transaction.gasBudget,
			gasPrice: (transaction) => transaction.gasPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			effectsDigest: (transaction) => transaction.effectsDigest,
		}),
	] as const,
} satisfies RegisteredSourceResolverModule
