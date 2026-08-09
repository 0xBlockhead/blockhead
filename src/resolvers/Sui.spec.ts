import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const executeSui = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Sui/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Sui/Graphql/client.ts')>(),
	executeSui,
}))

const { default: suiResolvers } = await import('$/resolvers/Sui.ts')
const balancesResolver = suiResolvers.resolvers[0]
const transactionsResolver = suiResolvers.resolvers[1]
const networkResolver = suiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.SuiNetwork
))
const checkpointResolver = suiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.SuiCheckpoint
))
const transactionResolver = suiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.SuiTransaction
))
const transactionTimestampResolver = suiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.SuiTransaction_Timestamp
))

if (networkResolver == null || checkpointResolver == null || transactionResolver == null || transactionTimestampResolver == null)
	throw new Error('Sui spec missing network/checkpoint/transaction resolvers')

const canonicalAddress = `0x${'0'.repeat(63)}2`
const account = {
	$network: {
		$network: {
			slug: 'sui',
		},
	},
	address: '0x2',
} as const
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Sui GraphQL public-account resolver', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		executeSui.mockReset()
	})

	it('materializes normalized source-provenanced balances with lossless amounts', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_752_624_000_000)
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
				balances: {
					pageInfo: {
						hasNextPage: true,
						endCursor: 'balance-cursor',
					},
					nodes: [
						{
							coinType: {
								repr: '0x2::sui::SUI',
							},
							totalBalance: '123456789012345678901234',
							coinBalance: '123456789012345678901000',
							addressBalance: '234',
						},
						{
							coinType: {
								repr: '0xabc::coin::COIN',
							},
							totalBalance: '9',
							coinBalance: '9',
							addressBalance: '0',
						},
					],
				},
			},
		})
		const snapshot = await balancesResolver.resolve['NetworkAddress'].resolve(
			account,
			context
		)

		expect(balancesResolver.projections.$$balances.select(snapshot, account, context)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: account.$network,
						address: canonicalAddress,
					},
					coinType: '0x2::sui::SUI',
					timestampMs: 1_752_624_000_000,
					source: 'Sui',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiCoinBalance_Timestamp, [], 'totalBalance')]: 123_456_789_012_345_678_901_234n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: account.$network,
						address: canonicalAddress,
					},
					coinType: '0xabc::coin::COIN',
					timestampMs: 1_752_624_000_000,
					source: 'Sui',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiCoinBalance_Timestamp, [], 'totalBalance')]: 9n,
				},
			},
		])
		expect(balancesResolver.projections.$$balances.continuation(snapshot, account, context)).toEqual({
			operation: 'account-balances',
			target: canonicalAddress,
			terminal: false,
			token: 'balance-cursor',
		})
		expect(executeSui.mock.calls[0][2]).toEqual({
			address: canonicalAddress,
			first: 2,
		})
	})

	it('preserves provider transaction order and canonicalizes sender identities', async () => {
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
			},
			transactions: {
				pageInfo: {
					hasNextPage: true,
					endCursor: 'transaction-cursor',
				},
				nodes: [
					{
						digest: 'TransactionDigest2',
						sender: {
							address: '0xA',
						},
					},
					{
						digest: 'TransactionDigest1',
						sender: null,
					},
				],
			},
		})
		const snapshot = await transactionsResolver.resolve['NetworkAddress'].resolve(
			account,
			context
		)
		const transactions = transactionsResolver.projections.$$transactions.select(snapshot, account, context)

		expect(transactions).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					digest: 'TransactionDigest2',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiTransaction, [], 'sender')]: `0x${'0'.repeat(63)}a`,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					digest: 'TransactionDigest1',
				},
			},
		])
		expect(transactionsResolver.projections.$$transactions.continuation(snapshot, account, context)).toEqual({
			operation: 'account-transactions',
			target: canonicalAddress,
			terminal: false,
			token: 'transaction-cursor',
		})
	})

	it('caps pages, terminates completed pages, and rejects invalid subjects before transport', async () => {
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
			},
			transactions: {
				pageInfo: {
					hasNextPage: false,
					endCursor: null,
				},
				nodes: [],
			},
		})
		const snapshot = await transactionsResolver.resolve['NetworkAddress'].resolve(account, {
			...context,
			pagination: {
				limit: 1_000,
			},
		})

		expect(executeSui.mock.calls[0][2]).toEqual({
			address: canonicalAddress,
			first: 50,
		})
		expect(transactionsResolver.projections.$$transactions.continuation(snapshot, account, context)).toEqual({
			operation: 'account-transactions',
			target: canonicalAddress,
			terminal: true,
		})

		executeSui.mockReset()
		await expect(transactionsResolver.resolve['NetworkAddress'].resolve({
			...account,
			address: '0xz',
		}, context)).rejects.toThrow('hexadecimal address')
		await expect(transactionsResolver.resolve['NetworkAddress'].resolve({
			...account,
			$network: {
				$network: {
					slug: 'sui-testnet',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(executeSui).not.toHaveBeenCalled()
	})

	it('fails closed on a malformed sender returned for an affected-address page', async () => {
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
			},
			transactions: {
				pageInfo: {
					hasNextPage: false,
					endCursor: null,
				},
				nodes: [{
					digest: 'TransactionDigest',
					sender: {
						address: 'not-an-address',
					},
				}],
			},
		})

		await expect(transactionsResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)).rejects.toThrow('hexadecimal address')
	})
})

const suiNetwork = {
	$network: {
		slug: 'sui',
	},
} as const

const tipCheckpointWire = {
	sequenceNumber: 100,
	digest: 'CheckpointDigest',
	previousCheckpointDigest: 'PreviousDigest',
	timestamp: '2026-08-06T12:00:00.000Z',
	networkTotalTransactions: 1_000,
	epoch: {
		epochId: 42,
		protocolConfigs: {
			protocolVersion: 88,
		},
	},
}

describe('Sui GraphQL network / checkpoint / transaction resolvers', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		executeSui.mockReset()
	})

	it('projects tip observation and checkpoint fields from the latest checkpoint', async () => {
		executeSui.mockResolvedValueOnce({
			checkpoint: tipCheckpointWire,
		})
		const snapshot = await networkResolver.resolve.Network.resolve(suiNetwork, context)
		expect(networkResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: suiNetwork,
				timestampMs: Date.parse('2026-08-06T12:00:00.000Z'),
				source: 'Sui',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'latestCheckpointSequence')]: 100n,
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'latestCheckpointDigest')]: 'CheckpointDigest',
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'epoch')]: 42n,
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'protocolVersion')]: 88n,
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'totalTransactionCount')]: 1000n,
			},
		}])
		expect(networkResolver.projections.$$checkpoints(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: suiNetwork,
				sequence: 100n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'digest')]: 'CheckpointDigest',
				[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'epoch')]: 42n,
				[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'timestampMs')]: Date.parse('2026-08-06T12:00:00.000Z'),
				[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'previousDigest')]: 'PreviousDigest',
			},
		}])
	})

	const networkFacetCheckpointsResolver = suiResolvers.resolvers.find((resolver) => (
		resolver.entityType === EntityType.Network
		&& 'Sui' in resolver.projections
		&& '$$checkpoints' in resolver.projections.Sui
	))
	const networkFacetTransactionsResolver = suiResolvers.resolvers.find((resolver) => (
		resolver.entityType === EntityType.Network
		&& 'Sui' in resolver.projections
		&& '$$transactions' in resolver.projections.Sui
		&& typeof resolver.projections.Sui.$$transactions === 'object'
		&& 'select' in resolver.projections.Sui.$$transactions
	))

	if (networkFacetCheckpointsResolver == null || networkFacetTransactionsResolver == null)
		throw new Error('Sui spec missing Network.Sui facet resolvers')

	it('projects Network.Sui tip observations, checkpoint tip-walk, and recent transactions', async () => {
		executeSui
			.mockResolvedValueOnce({
				checkpoint: tipCheckpointWire,
			})
			.mockResolvedValueOnce({
				checkpoint: {
					...tipCheckpointWire,
					sequenceNumber: 99,
					digest: 'PriorCheckpointDigest',
				},
			})
			.mockResolvedValueOnce({
				transactions: {
					pageInfo: {
						hasNextPage: false,
						endCursor: null,
					},
					nodes: [{
						digest: 'TransactionDigest',
						sender: {
							address: canonicalAddress,
						},
					}],
				},
			})

		const facetSnapshot = await networkFacetCheckpointsResolver.resolve.Slug.resolve({
			slug: 'sui',
		}, context)
		expect(networkFacetCheckpointsResolver.projections.Sui.$$timestamps(facetSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: suiNetwork,
				timestampMs: Date.parse('2026-08-06T12:00:00.000Z'),
				source: 'Sui',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'latestCheckpointSequence')]: 100n,
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'latestCheckpointDigest')]: 'CheckpointDigest',
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'epoch')]: 42n,
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'protocolVersion')]: 88n,
				[entityFieldAddressKey(EntityType.SuiNetwork_Timestamp, [], 'totalTransactionCount')]: 1000n,
			},
		}])
		expect(networkFacetCheckpointsResolver.projections.Sui.$$checkpoints(facetSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: suiNetwork,
					sequence: 100n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'digest')]: 'CheckpointDigest',
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'epoch')]: 42n,
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'timestampMs')]: Date.parse('2026-08-06T12:00:00.000Z'),
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'previousDigest')]: 'PreviousDigest',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: suiNetwork,
					sequence: 99n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'digest')]: 'PriorCheckpointDigest',
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'epoch')]: 42n,
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'timestampMs')]: Date.parse('2026-08-06T12:00:00.000Z'),
					[entityFieldAddressKey(EntityType.SuiCheckpoint, [], 'previousDigest')]: 'PreviousDigest',
				},
			},
		])

		const transactionsSnapshot = await networkFacetTransactionsResolver.resolve.Slug.resolve({
			slug: 'sui',
		}, context)
		expect(networkFacetTransactionsResolver.projections.Sui.$$transactions.select(transactionsSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: suiNetwork,
				digest: 'TransactionDigest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiTransaction, [], 'sender')]: canonicalAddress,
			},
		}])
	})

	it('resolves checkpoint selectors and singular transaction snapshots', async () => {
		executeSui
			.mockResolvedValueOnce({
				checkpoint: tipCheckpointWire,
			})
			.mockResolvedValueOnce({
				transaction: {
					digest: 'TransactionDigest',
					sender: {
						address: canonicalAddress,
					},
					kind: {
						__typename: 'ProgrammableTransaction',
						commands: {
							nodes: [{
								__typename: 'MoveCallCommand',
								function: {
									name: 'transfer',
									module: {
										name: 'pay',
										package: {
											address: canonicalAddress,
										},
									},
								},
								arguments: [{
									__typename: 'Input',
									ix: 0,
								}],
							}],
						},
					},
					gasInput: {
						gasBudget: '1000',
						gasPrice: '1000',
					},
					effects: {
						status: 'SUCCESS',
						effectsDigest: 'EffectsDigest',
						timestamp: '2026-08-06T12:00:00.000Z',
						gasEffects: {
							gasSummary: {
								computationCost: 10,
								storageCost: 20,
								storageRebate: 5,
								nonRefundableStorageFee: 1,
							},
						},
						checkpoint: {
							sequenceNumber: 100,
						},
						balanceChanges: {
							nodes: [{
								owner: {
									address: canonicalAddress,
								},
								coinType: {
									repr: '0x2::sui::SUI',
								},
								amount: '-42',
							}],
						},
						objectChanges: {
							nodes: [{
								address: canonicalAddress,
								idCreated: false,
								idDeleted: false,
								outputState: {
									version: 9,
									digest: 'ObjectDigest',
									asMoveObject: {
										contents: {
											type: {
												repr: '0x2::coin::Coin<0x2::sui::SUI>',
											},
										},
									},
									owner: {
										__typename: 'AddressOwner',
										address: {
											address: canonicalAddress,
										},
									},
								},
							}],
						},
						events: {
							nodes: [{
								sequenceNumber: 0,
								sender: {
									address: canonicalAddress,
								},
								contents: {
									type: {
										repr: '0x2::coin::TransferEvent',
									},
									json: {
										ok: true,
									},
								},
								transactionModule: {
									name: 'pay',
									package: {
										address: canonicalAddress,
									},
								},
							}],
						},
					},
				},
			})
			.mockResolvedValueOnce({
				transaction: {
					digest: 'TransactionDigest',
					sender: {
						address: canonicalAddress,
					},
					kind: {
						__typename: 'ProgrammableTransaction',
						commands: {
							nodes: [],
						},
					},
					gasInput: {
						gasBudget: '1000',
						gasPrice: '1000',
					},
					effects: {
						status: 'SUCCESS',
						effectsDigest: 'EffectsDigest',
						timestamp: '2026-08-06T12:00:00.000Z',
						gasEffects: {
							gasSummary: {
								computationCost: 10,
								storageCost: 20,
								storageRebate: 5,
								nonRefundableStorageFee: 1,
							},
						},
						checkpoint: {
							sequenceNumber: 100,
						},
						balanceChanges: {
							nodes: [],
						},
						objectChanges: {
							nodes: [],
						},
						events: {
							nodes: [],
						},
					},
				},
			})

		const checkpoint = await checkpointResolver.resolve.NetworkSequence.resolve({
			$network: suiNetwork,
			sequence: 100n,
		}, context)
		expect(checkpointResolver.projections.digest(checkpoint)).toBe('CheckpointDigest')
		expect(checkpointResolver.projections.sequence(checkpoint)).toBe(100n)

		const transactionSnapshot = await transactionResolver.resolve.NetworkDigest.resolve({
			$network: suiNetwork,
			digest: 'TransactionDigest',
		}, context)
		expect(transactionResolver.projections.transactionKind(transactionSnapshot)).toBe('ProgrammableTransaction')
		expect(transactionResolver.projections.$$timestamps(transactionSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: suiNetwork,
					digest: 'TransactionDigest',
				},
				checkpointSequence: 100n,
				source: 'Sui',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'timestampMs')]: Date.parse('2026-08-06T12:00:00.000Z'),
				[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'status')]: 'SUCCESS',
				[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'gasBudget')]: 1000n,
				[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'gasPrice')]: 1000n,
				[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'gasUsed')]: {
					computationCost: '10',
					storageCost: '20',
					storageRebate: '5',
					nonRefundableStorageFee: '1',
				},
				[entityFieldAddressKey(EntityType.SuiTransaction_Timestamp, [], 'effectsDigest')]: 'EffectsDigest',
			},
		}])
		expect(transactionResolver.projections.$$commands(transactionSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: suiNetwork,
					digest: 'TransactionDigest',
				},
				commandIndex: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'commandKind')]: 'MoveCallCommand',
				[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'typeArguments')]: [],
				[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'packageId')]: canonicalAddress,
				[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'moduleName')]: 'pay',
				[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'functionName')]: 'transfer',
				[entityFieldAddressKey(EntityType.SuiProgrammableTransactionCommand, [], 'arguments')]: [{
					kind: 'Input',
					ix: 0,
				}],
			},
		}])
		expect(transactionResolver.projections.$$balanceChanges(transactionSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: suiNetwork,
					digest: 'TransactionDigest',
				},
				changeIndex: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiBalanceChange, [], 'amountDelta')]: -42n,
				[entityFieldAddressKey(EntityType.SuiBalanceChange, [], 'ownerSelector')]: {
					kind: 'Address',
					address: canonicalAddress,
				},
				[entityFieldAddressKey(EntityType.SuiBalanceChange, [], 'coinType')]: '0x2::sui::SUI',
				[entityFieldAddressKey(EntityType.SuiBalanceChange, [], '$coinType')]: {
					[EntityMetaKey.Selector]: {
						$network: suiNetwork,
						coinType: '0x2::sui::SUI',
					},
				},
			},
		}])
		expect(transactionResolver.projections.$$objectChanges(transactionSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: suiNetwork,
					digest: 'TransactionDigest',
				},
				changeIndex: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'changeKind')]: 'Mutated',
				[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'objectId')]: canonicalAddress,
				[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'objectType')]: '0x2::coin::Coin<0x2::sui::SUI>',
				[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'ownerSelector')]: {
					kind: 'AddressOwner',
					address: canonicalAddress,
				},
				[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'version')]: 9n,
				[entityFieldAddressKey(EntityType.SuiObjectChange, [], 'digest')]: 'ObjectDigest',
			},
		}])
		expect(transactionResolver.projections.$$events(transactionSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: suiNetwork,
				transactionDigest: 'TransactionDigest',
				eventIndex: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.SuiEvent, [], 'eventType')]: '0x2::coin::TransferEvent',
				[entityFieldAddressKey(EntityType.SuiEvent, [], 'packageId')]: canonicalAddress,
				[entityFieldAddressKey(EntityType.SuiEvent, [], 'moduleName')]: 'pay',
				[entityFieldAddressKey(EntityType.SuiEvent, [], 'sender')]: canonicalAddress,
				[entityFieldAddressKey(EntityType.SuiEvent, [], 'value')]: {
					ok: true,
				},
			},
		}])

		const observation = await transactionTimestampResolver.resolve.TransactionCheckpointSequenceSource.resolve({
			$transaction: {
				$network: suiNetwork,
				digest: 'TransactionDigest',
			},
			checkpointSequence: 100n,
			source: 'Sui',
		}, context)
		expect(transactionTimestampResolver.projections.status(observation)).toBe('SUCCESS')
		expect(transactionTimestampResolver.projections.checkpointSequence(observation)).toBe(100n)
	})
})
