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
import { normalizeSuiAddress } from '$/sources/Sui/Graphql/queries.ts'
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

const suiCheckpointSequenceApplicability = [{
	$network: suiNetworkApplicability[0],
}] as const
const suiCheckpointDigestApplicability = suiCheckpointSequenceApplicability
const suiChildApplicability = suiCheckpointSequenceApplicability

const suiTransactionApplicability = suiCheckpointSequenceApplicability

const suiTransactionTimestampApplicability = [
	{
		$transaction: suiTransactionApplicability[0],
		source: Source.Sui,
	},
] as const
const suiTransactionChildApplicability = [{
	$transaction: suiTransactionApplicability[0],
}] as const

const loadSuiQueries = () => (
	typeof window === 'undefined' ?
		import('$/sources/Sui/Graphql/queries.ts')
	:
		import('$/sources/Sui/Graphql/queries.remote.ts')
)

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
						} = await loadSuiQueries()
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
						} = await loadSuiQueries()
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
			entityType: EntityType.SuiAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertSuiNetwork(account.$network.$network)
						const {
							getAddressObjects,
						} = await loadSuiQueries()
						const address = normalizeSuiAddress(account.address)
						const page = await getAddressObjects({
							address,
							limit: Math.min(resolverContextRowLimit(context), 50),
							after: context.providerContinuationToken,
						})

						return {
							address,
							page,
						}
					},
				},
			},
		})({
			$$objects: {
				select: ({ page }, account) => page.objects.map((object) => ({
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						objectId: object.objectId,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.SuiObject, [], '$$versions')]: [{
							[EntityMetaKey.Selector]: {
								$network: account.$network,
								objectId: object.objectId,
								version: object.version,
								digest: object.digest,
							},
							[EntityMetaKey.Fields]: {
								...(object.objectType != null && {
									[entityFieldAddressKey(EntityType.SuiObjectVersion, [], 'objectType')]: object.objectType,
								}),
							},
						}],
					},
				})),
				continuation: ({
					address,
					page,
				}) => (
					page.pagination.nextAfter == null ?
						{
							operation: 'account-objects',
							target: address,
							terminal: true,
						}
					:
						{
							operation: 'account-objects',
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
						const { getLatestCheckpoint } = await loadSuiQueries()
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
						} = await loadSuiQueries()
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
									getCheckpointBySequence( tip.sequence - BigInt(offset + 1))
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
						const { getRecentTransactions } = await loadSuiQueries()
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
						const { getLatestCheckpoint } = await loadSuiQueries()
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
						const { getCheckpointBySequence } = await loadSuiQueries()
						return getCheckpointBySequence( sequence)
					},
				},
				NetworkDigest: {
					appliesTo: suiCheckpointDigestApplicability,
					resolve: async ({
						$network,
						digest,
					}) => {
						assertSuiNetworkEntity($network)
						const { getCheckpointByDigest } = await loadSuiQueries()
						return getCheckpointByDigest( digest)
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
						const { getTransaction } = await loadSuiQueries()
						const transaction = await getTransaction( digest)
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
			$$commands: ({
				$network,
				transaction,
			}) => transaction.commands.map((command) => ({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network,
						digest: transaction.digest,
					},
					commandIndex: command.commandIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'commandKind')]: command.commandKind,
					[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'typeArguments')]: command.typeArguments,
					...(command.packageId != null && {
						[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'packageId')]: command.packageId,
					}),
					...(command.moduleName != null && {
						[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'moduleName')]: command.moduleName,
					}),
					...(command.functionName != null && {
						[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'functionName')]: command.functionName,
					}),
					...('arguments' in command && command.arguments != null && {
						[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'arguments')]: command.arguments,
					}),
				},
			})),
			$$objectChanges: ({
				$network,
				transaction,
			}) => transaction.objectChanges.map((change) => ({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network,
						digest: transaction.digest,
					},
					changeIndex: change.changeIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'changeKind')]: change.changeKind,
					...(change.objectId != null && {
						[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'objectId')]: change.objectId,
					}),
					...(change.objectType != null && {
						[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'objectType')]: change.objectType,
					}),
					...(change.ownerSelector != null && {
						[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'ownerSelector')]: change.ownerSelector,
					}),
					...(change.version != null && {
						[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'version')]: change.version,
					}),
					...(change.digest != null && {
						[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'digest')]: change.digest,
					}),
				},
			})),
			$$balanceChanges: ({
				$network,
				transaction,
			}) => transaction.balanceChanges.map((change) => ({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network,
						digest: transaction.digest,
					},
					changeIndex: change.changeIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiBalanceChange, [], 'amountDelta')]: change.amountDelta,
					...(change.ownerSelector != null && {
						[entityFieldAddressKey(EntityType.SuiBalanceChange, [], 'ownerSelector')]: change.ownerSelector,
					}),
					...(change.coinType != null && {
						[entityFieldAddressKey(EntityType.SuiBalanceChange, [], 'coinType')]: change.coinType,
					}),
					...(change.coinType != null && {
						[entityFieldAddressKey(EntityType.SuiBalanceChange, [], '$coinType')]: {
							[EntityMetaKey.Selector]: {
								$network,
								coinType: change.coinType,
							},
						},
					}),
				},
			})),
			$$events: ({
				$network,
				transaction,
			}) => transaction.events.map((event) => ({
				[EntityMetaKey.Selector]: {
					$network,
					transactionDigest: transaction.digest,
					eventIndex: event.eventIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiEvent, [], 'eventType')]: event.eventType,
					...(event.packageId != null && {
						[entityFieldAddressKey(EntityType.SuiEvent, [], 'packageId')]: event.packageId,
					}),
					...(event.moduleName != null && {
						[entityFieldAddressKey(EntityType.SuiEvent, [], 'moduleName')]: event.moduleName,
					}),
					...(event.sender != null && {
						[entityFieldAddressKey(EntityType.SuiEvent, [], 'sender')]: event.sender,
					}),
					...(event.value != null && {
						[entityFieldAddressKey(EntityType.SuiEvent, [], 'value')]: event.value,
					}),
				},
			})),
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
						const { getTransaction } = await loadSuiQueries()
						const transaction = await getTransaction( $transaction.digest)
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

		defineResolver({
			entityType: EntityType.SuiEvent,
			resolve: {
				NetworkTransactionDigestEventIndex: {
					appliesTo: suiChildApplicability,
					resolve: async ({
						$network,
						transactionDigest,
						eventIndex,
					}) => {
						assertSuiNetworkEntity($network)
						const { getTransaction } = await loadSuiQueries()
						const event = (await getTransaction(transactionDigest)).events.find(
							(candidate) => candidate.eventIndex === eventIndex
						)
						if (event == null)
							throw new Error('Sui: transaction event index was not found')

						return event
					},
				},
			},
		})({
			eventType: (event) => event.eventType,
			packageId: (event) => event.packageId,
			moduleName: (event) => event.moduleName,
			sender: (event) => event.sender,
			value: (event) => event.value,
		}),

		defineResolver({
			entityType: EntityType.SuiProgrammableTransactionCommand,
			resolve: {
				TransactionCommandIndex: {
					appliesTo: suiTransactionChildApplicability,
					resolve: async ({
						$transaction,
						commandIndex,
					}) => {
						assertSuiNetworkEntity($transaction.$network)
						const { getTransaction } = await loadSuiQueries()
						const command = (await getTransaction($transaction.digest)).commands.at(commandIndex)
						if (command == null)
							throw new Error('Sui: transaction command index was not found')

						return command
					},
				},
			},
		})({
			commandKind: (command) => command.commandKind,
			packageId: (command) => command.packageId,
			moduleName: (command) => command.moduleName,
			functionName: (command) => command.functionName,
			typeArguments: (command) => command.typeArguments,
			arguments: (command) => ('arguments' in command ? command.arguments : undefined),
		}),

		defineResolver({
			entityType: EntityType.SuiBalanceChange,
			resolve: {
				TransactionChangeIndex: {
					appliesTo: suiTransactionChildApplicability,
					resolve: async ({
						$transaction,
						changeIndex,
					}) => {
						assertSuiNetworkEntity($transaction.$network)
						const { getTransaction } = await loadSuiQueries()
						const change = (await getTransaction($transaction.digest)).balanceChanges.at(changeIndex)
						if (change == null)
							throw new Error('Sui: transaction balance-change index was not found')

						return {
							$network: $transaction.$network,
							change,
						}
					},
				},
			},
		})({
			ownerSelector: ({ change }) => change.ownerSelector,
			coinType: ({ change }) => change.coinType,
			$coinType: ({
				$network,
				change,
			}) => ({
				[EntityMetaKey.Selector]: {
					$network,
					coinType: change.coinType,
				},
			}),
			amountDelta: ({ change }) => change.amountDelta,
		}),

		defineResolver({
			entityType: EntityType.SuiObjectChange,
			resolve: {
				TransactionChangeIndex: {
					appliesTo: suiTransactionChildApplicability,
					resolve: async ({
						$transaction,
						changeIndex,
					}) => {
						assertSuiNetworkEntity($transaction.$network)
						const { getTransaction } = await loadSuiQueries()
						const change = (await getTransaction($transaction.digest)).objectChanges.at(changeIndex)
						if (change == null)
							throw new Error('Sui: transaction object-change index was not found')

						return change
					},
				},
			},
		})({
			changeKind: (change) => change.changeKind,
			objectId: (change) => change.objectId,
			objectType: (change) => change.objectType,
			ownerSelector: (change) => change.ownerSelector,
			version: (change) => change.version,
			digest: (change) => change.digest,
		}),

		defineResolver({
			entityType: EntityType.SuiObject,
			resolve: {
				NetworkObjectId: {
					appliesTo: suiChildApplicability,
					resolve: async ({
						$network,
						objectId,
					}) => {
						assertSuiNetworkEntity($network)
						const { getObject } = await loadSuiQueries()
						const object = await getObject( objectId)
						return {
							$network,
							object,
						}
					},
				},
			},
		})({
			objectId: ({ object }) => object.objectId,
			$$versions: ({
				$network,
				object,
			}) => [{
				[EntityMetaKey.Selector]: {
					$network,
					objectId: object.objectId,
					version: object.version,
					digest: object.digest,
				},
				[EntityMetaKey.Fields]: {
					...(object.ownerSelector != null && {
						[entityFieldAddressKey(EntityType.SuiObjectVersion, [], 'ownerSelector')]: object.ownerSelector,
					}),
					...(object.objectType != null && {
						[entityFieldAddressKey(EntityType.SuiObjectVersion, [], 'objectType')]: object.objectType,
					}),
					...(object.previousTransaction != null && {
						[entityFieldAddressKey(EntityType.SuiObjectVersion, [], 'previousTransaction')]: object.previousTransaction,
					}),
					...(object.storageRebate != null && {
						[entityFieldAddressKey(EntityType.SuiObjectVersion, [], 'storageRebate')]: object.storageRebate,
					}),
					...(object.contents != null && {
						[entityFieldAddressKey(EntityType.SuiObjectVersion, [], 'contents')]: object.contents,
					}),
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.SuiObjectVersion,
			resolve: {
				NetworkObjectIdVersionDigest: {
					appliesTo: suiChildApplicability,
					resolve: async ({
						$network,
						objectId,
						version,
						digest,
					}) => {
						assertSuiNetworkEntity($network)
						const { getObject } = await loadSuiQueries()
						const object = await getObject( objectId)
						if (object.version !== version || object.digest !== digest)
							throw new Error('Sui: object version/digest mismatch')
						return object
					},
				},
			},
		})({
			digest: (object) => object.digest,
			version: (object) => object.version,
			ownerSelector: (object) => object.ownerSelector,
			objectType: (object) => object.objectType,
			previousTransaction: (object) => object.previousTransaction,
			storageRebate: (object) => object.storageRebate,
			contents: (object) => object.contents,
		}),

		defineResolver({
			entityType: EntityType.SuiCoinType,
			resolve: {
				NetworkCoinType: {
					appliesTo: suiChildApplicability,
					resolve: async ({
						$network,
						coinType,
					}) => {
						assertSuiNetworkEntity($network)
						const { getCoinMetadata } = await loadSuiQueries()
						return {
							$network,
							coin: await getCoinMetadata(coinType),
						}
					},
				},
			},
		})({
			coinType: ({ coin }) => coin.coinType,
			decimals: ({ coin }) => coin.decimals,
			symbol: ({ coin }) => coin.symbol,
			name: ({ coin }) => coin.name,
			description: ({ coin }) => coin.description,
			iconUrl: ({ coin }) => coin.iconUrl,
			$$regulatedStates: ({
				$network,
				coin,
			}) => coin.denyCap == null ? [] : [{
				[EntityMetaKey.Selector]: {
					$coinType: {
						$network,
						coinType: coin.coinType,
					},
					timestampMs: coin.fetchedAtMs,
					source: Source.Sui,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiRegulatedCoinState_Timestamp, [], 'denyCapObjectId')]: coin.denyCap.objectId,
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.SuiPackage,
			resolve: {
				NetworkOriginalPackageId: {
					appliesTo: suiChildApplicability,
					resolve: async ({
						$network,
						originalPackageId,
					}, context) => {
						assertSuiNetworkEntity($network)
						const { getPackage } = await loadSuiQueries()
						const suiPackage = await getPackage({
							packageId: originalPackageId,
							moduleLimit: Math.min(resolverContextRowLimit(context), 50),
						})
						return {
							$network,
							suiPackage,
						}
					},
				},
			},
		})({
			originalPackageId: ({ suiPackage }) => suiPackage.packageId,
			$$versions: ({
				$network,
				suiPackage,
			}) => [{
				[EntityMetaKey.Selector]: {
					$network,
					packageId: suiPackage.packageId,
					version: suiPackage.version,
					digest: suiPackage.digest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiPackageVersion, [], '$package')]: {
						[EntityMetaKey.Selector]: {
							$network,
							originalPackageId: suiPackage.packageId,
						},
					},
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.SuiPackageVersion,
			resolve: {
				NetworkPackageIdVersionDigest: {
					appliesTo: suiChildApplicability,
					resolve: async ({
						$network,
						packageId,
						version,
						digest,
					}, context) => {
						assertSuiNetworkEntity($network)
						const { getPackage } = await loadSuiQueries()
						const suiPackage = await getPackage({
							packageId,
							moduleLimit: Math.min(resolverContextRowLimit(context), 50),
							moduleAfter: context.providerContinuationToken,
						})
						if (suiPackage.version !== version || suiPackage.digest !== digest)
							throw new Error('Sui: package version selector does not match the current package')

						return {
							$network,
							suiPackage,
						}
					},
				},
			},
		})({
			$$modules: {
				select: ({
					$network,
					suiPackage,
				}) => suiPackage.moduleNames.map((moduleName) => ({
					[EntityMetaKey.Selector]: {
						$network: $network.$network,
						address: suiPackage.packageId,
						moduleName,
					},
				})),
				continuation: ({ suiPackage }) => (
					suiPackage.modulePagination.nextAfter == null ?
						{
							operation: 'package-modules',
							target: suiPackage.packageId,
							terminal: true,
						}
					:
						{
							operation: 'package-modules',
							target: suiPackage.packageId,
							terminal: false,
							token: suiPackage.modulePagination.nextAfter,
						}
				),
			},
		}),
	] as const,
} satisfies RegisteredSourceResolverModule
