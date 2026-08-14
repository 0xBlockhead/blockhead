import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getAvs = vi.hoisted(() => vi.fn())
const getOperator = vi.hoisted(() => vi.fn())
const getOperatorRewardInfo = vi.hoisted(() => vi.fn())
const getStrategyTvl = vi.hoisted(() => vi.fn())
const listAvss = vi.hoisted(() => vi.fn())
const listAvsAllocations = vi.hoisted(() => vi.fn())
const listAvsOperators = vi.hoisted(() => vi.fn())
const listAvsSlashes = vi.hoisted(() => vi.fn())
const listOperatorAllocations = vi.hoisted(() => vi.fn())
const listOperators = vi.hoisted(() => vi.fn())
const listOperatorSlashes = vi.hoisted(() => vi.fn())
const listStrategies = vi.hoisted(() => vi.fn())
const getStaker = vi.hoisted(() => vi.fn())
const getStakerDeposits = vi.hoisted(() => vi.fn())
const getStakerWithdrawals = vi.hoisted(() => vi.fn())

vi.mock('$/sources/EigenExplorer/Rest/queries.ts', () => ({
	getAvs,
	getOperator,
	getOperatorRewardInfo,
	getStrategyTvl,
	listAvss,
	listAvsAllocations,
	listAvsOperators,
	listAvsSlashes,
	listOperatorAllocations,
	listOperators,
	listOperatorSlashes,
	listStrategies,
	getStaker,
	getStakerDeposits,
	getStakerWithdrawals,
}))

const { default: eigenExplorerResolvers } = await import('$/resolvers/EigenExplorer-Rest.ts')

const [
	delegationResolver,
	,
	operatorResolver,
	operatorRewardsResolver,
	rewardTimestampResolver,
	avsResolver,
	avsTimestampsResolver,
	avsOperatorsResolver,
	avsTimestampResolver,
	strategyResolver,
	operatorAllocationsResolver,
	avsAllocationsResolver,
	allocationTimestampResolver,
	operatorSlashesResolver,
	avsSlashesResolver,
	slashEventResolver,
	protocolOperatorsResolver,
	protocolAvssResolver,
	protocolStrategiesResolver,
] = eigenExplorerResolvers.resolvers
const stakerAddress = '0x1111111111111111111111111111111111111111'
const operatorAddress = '0x2222222222222222222222222222222222222222'
const avsAddress = '0x7777777777777777777777777777777777777777'
const strategyAddress = '0x3333333333333333333333333333333333333333'
const tokenAddress = '0x4444444444444444444444444444444444444444'
const transactionHash = `0x${'5'.repeat(64)}`
const withdrawalRoot = `0x${'6'.repeat(64)}`
const timestampMs = Date.parse('2026-01-02T00:00:00.000Z')
const network = {
	caip2: networkBySlug.ethereum.caip2,
}
const selector = {
	$staker: {
		$network: network,
		$actor: {
			address: stakerAddress,
		},
	},
	$operator: {
		$network: network,
		operatorAddress,
	},
	$strategy: {
		$network: network,
		strategyAddress,
	},
	timestampMs,
	source: Source.EigenExplorer_Rest,
}
const operatorSelector = {
	$network: network,
	operatorAddress,
}
const avsSelector = {
	$network: network,
	avsAddress,
}
const protocolSelector = {
	$network: network,
}
const avsTimestampSelector = {
	$avs: {
		$network: network,
		avsAddress,
	},
	timestampMs,
	source: Source.EigenExplorer_Rest,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const evmNetworkAccountResolver = eigenExplorerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
))

if (evmNetworkAccountResolver == null)
	throw new Error('EigenExplorer_Rest: EvmNetworkAccount resolver missing')

describe('EigenExplorer delegation resolver', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getStaker.mockReset()
		getStakerDeposits.mockReset()
		getStakerWithdrawals.mockReset()
		getStaker.mockResolvedValue({
			address: stakerAddress,
			operatorAddress,
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [{
				strategyAddress,
				shares: '900719925474099312345',
			}],
		})
		getStakerDeposits.mockResolvedValue({
			data: [{
				transactionHash,
				stakerAddress,
				tokenAddress,
				strategyAddress,
				shares: '900719925474099312345',
				createdAtBlock: 100,
				createdAt: '2026-01-01T00:00:00.000Z',
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		getStakerWithdrawals.mockResolvedValue({
			data: [{
				withdrawalRoot,
				nonce: 7,
				stakerAddress,
				delegatedTo: operatorAddress,
				withdrawerAddress: stakerAddress,
				shares: [{
					strategyAddress,
					shares: '42',
				}],
				createdAtBlock: 100,
				createdAt: '2026-01-01T00:00:00.000Z',
				updatedAtBlock: 101,
				updatedAt: '2026-01-02T00:00:00.000Z',
				isCompleted: false,
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
	})

	it('projects current mainnet staker shares as typed delegation observations', async () => {
		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: stakerAddress,
			},
		}, context)

		expect(evmNetworkAccountResolver.projections.$$eigenLayerDelegations.select(account)).toEqual([{
			[EntityMetaKey.Selector]: selector,
		}])
		expect(evmNetworkAccountResolver.projections.$$eigenLayerDelegations.resolveCount(account)).toBe(1)
		expect(getStaker).toHaveBeenCalledWith(stakerAddress)
	})

	it('keeps an explicit no-operator staker response as an empty delegation list', async () => {
		getStaker.mockResolvedValueOnce({
			address: stakerAddress,
			operatorAddress: null,
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [],
		})

		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: stakerAddress,
			},
		}, context)

		expect(evmNetworkAccountResolver.projections.$$eigenLayerDelegations.select(account)).toEqual([])
		expect(evmNetworkAccountResolver.projections.$$eigenLayerDelegations.resolveCount(account)).toBe(0)
	})

	it('rejects non-mainnet account composition before transport', async () => {
		await expect(evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: {
				caip2: networkBySlug.base.caip2,
			},
			$actor: {
				address: stakerAddress,
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getStaker).not.toHaveBeenCalled()
	})

	it('projects delegated shares plus deposit and withdrawal fields', async () => {
		const delegation = await delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve(
			selector,
			context
		)

		expect(delegationResolver.projections.delegatedShares(delegation)).toBe(900719925474099312345n)
		expect(delegationResolver.projections.depositRoot(delegation)).toBe(transactionHash)
		expect(delegationResolver.projections.withdrawalRoot(delegation)).toBe(withdrawalRoot)
		expect(delegationResolver.projections.withdrawalQueued(delegation)).toBe(true)
		expect(delegationResolver.projections.withdrawalCompleted(delegation)).toBe(false)
		expect(getStaker).toHaveBeenCalledOnce()
		expect(getStakerDeposits).toHaveBeenCalledWith(stakerAddress)
		expect(getStakerWithdrawals).toHaveBeenCalledWith(stakerAddress)
	})

	it('projects the latest authoritative strategy lifecycle instead of response order', async () => {
		getStakerDeposits.mockResolvedValueOnce({
			data: [
				{
					transactionHash,
					stakerAddress,
					tokenAddress,
					strategyAddress,
					shares: '1',
					createdAtBlock: 100,
					createdAt: '2026-01-01T00:00:00.000Z',
				},
				{
					transactionHash: `0x${'7'.repeat(64)}`,
					stakerAddress,
					tokenAddress,
					strategyAddress,
					shares: '2',
					createdAtBlock: 102,
					createdAt: '2026-01-03T00:00:00.000Z',
				},
			],
			meta: {
				total: 2,
				skip: 0,
				take: 100,
			},
		})
		getStakerWithdrawals.mockResolvedValueOnce({
			data: [
				{
					withdrawalRoot,
					nonce: 7,
					stakerAddress,
					delegatedTo: operatorAddress,
					withdrawerAddress: stakerAddress,
					shares: [{ strategyAddress, shares: '42' }],
					createdAtBlock: 100,
					createdAt: '2026-01-01T00:00:00.000Z',
					updatedAtBlock: 101,
					updatedAt: '2026-01-02T00:00:00.000Z',
					isCompleted: false,
				},
				{
					withdrawalRoot: `0x${'8'.repeat(64)}`,
					nonce: 8,
					stakerAddress,
					delegatedTo: operatorAddress,
					withdrawerAddress: stakerAddress,
					shares: [{ strategyAddress, shares: '42' }],
					createdAtBlock: 102,
					createdAt: '2026-01-03T00:00:00.000Z',
					updatedAtBlock: 103,
					updatedAt: '2026-01-04T00:00:00.000Z',
					isCompleted: true,
				},
			],
			meta: {
				total: 2,
				skip: 0,
				take: 100,
			},
		})

		const delegation = await delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve(
			selector,
			context
		)

		expect(delegationResolver.projections.depositRoot(delegation)).toBe(`0x${'7'.repeat(64)}`)
		expect(delegationResolver.projections.withdrawalRoot(delegation)).toBe(`0x${'8'.repeat(64)}`)
		expect(delegationResolver.projections.withdrawalCompleted(delegation)).toBe(true)
	})

	it('walks every authoritative lifecycle page before selecting current strategy state', async () => {
		getStakerDeposits.mockResolvedValueOnce({
			data: [{
				transactionHash,
				stakerAddress,
				tokenAddress,
				strategyAddress,
				shares: '1',
				createdAtBlock: 100,
				createdAt: '2026-01-01T00:00:00.000Z',
			}],
			meta: {
				total: 2,
				skip: 0,
				take: 100,
			},
		})
		getStakerDeposits.mockResolvedValueOnce({
			data: [{
				transactionHash: `0x${'7'.repeat(64)}`,
				stakerAddress,
				tokenAddress,
				strategyAddress,
				shares: '2',
				createdAtBlock: 102,
				createdAt: '2026-01-03T00:00:00.000Z',
			}],
			meta: {
				total: 2,
				skip: 1,
				take: 100,
			},
		})
		getStakerWithdrawals.mockResolvedValueOnce({
			data: [{
				withdrawalRoot,
				nonce: 7,
				stakerAddress,
				delegatedTo: operatorAddress,
				withdrawerAddress: stakerAddress,
				shares: [{ strategyAddress, shares: '42' }],
				createdAtBlock: 100,
				createdAt: '2026-01-01T00:00:00.000Z',
				updatedAtBlock: 101,
				updatedAt: '2026-01-02T00:00:00.000Z',
				isCompleted: false,
			}],
			meta: {
				total: 2,
				skip: 0,
				take: 100,
			},
		})
		getStakerWithdrawals.mockResolvedValueOnce({
			data: [{
				withdrawalRoot: `0x${'8'.repeat(64)}`,
				nonce: 8,
				stakerAddress,
				delegatedTo: operatorAddress,
				withdrawerAddress: stakerAddress,
				shares: [{ strategyAddress, shares: '42' }],
				createdAtBlock: 102,
				createdAt: '2026-01-03T00:00:00.000Z',
				updatedAtBlock: 103,
				updatedAt: '2026-01-04T00:00:00.000Z',
				isCompleted: true,
			}],
			meta: {
				total: 2,
				skip: 1,
				take: 100,
			},
		})

		const delegation = await delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve(
			selector,
			context
		)

		expect(delegationResolver.projections.depositRoot(delegation)).toBe(`0x${'7'.repeat(64)}`)
		expect(delegationResolver.projections.withdrawalRoot(delegation)).toBe(`0x${'8'.repeat(64)}`)
		expect(delegationResolver.projections.withdrawalCompleted(delegation)).toBe(true)
		expect(getStakerDeposits).toHaveBeenNthCalledWith(2, stakerAddress, {
			skip: 1,
			take: 100,
		})
		expect(getStakerWithdrawals).toHaveBeenNthCalledWith(2, stakerAddress, {
			skip: 1,
			take: 100,
		})
	})

	it('fails closed when a lifecycle page cannot make progress', async () => {
		getStakerDeposits.mockResolvedValue({
			data: [],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})

		await expect(delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve(
			selector,
			context
		)).rejects.toThrow('deposit lifecycle pagination stalled')
	})

	it('rejects non-mainnet selectors before transport', async () => {
		await expect(delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve({
			...selector,
			$staker: {
				...selector.$staker,
				$network: {
					caip2: networkBySlug.base.caip2,
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getStaker).not.toHaveBeenCalled()
	})

	it('rejects snapshots whose operator or source does not match', async () => {
		getStaker.mockResolvedValueOnce({
			address: stakerAddress,
			operatorAddress: '0x4444444444444444444444444444444444444444',
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [],
		})
		await expect(delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve(
			selector,
			context
		)).rejects.toThrow('operator mismatch')

		await expect(delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve({
			...selector,
			source: Source.EigenLayerContracts_Evm,
		}, context)).rejects.toThrow('source mismatch')
		expect(getStaker).toHaveBeenCalledOnce()
	})

	it('rejects snapshots whose strategy or timestamp does not match', async () => {
		await expect(delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve({
			...selector,
			timestampMs: timestampMs + 1,
		}, context)).rejects.toThrow('timestamp mismatch')

		await expect(delegationResolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve({
			...selector,
			$strategy: {
				...selector.$strategy,
				strategyAddress: '0x5555555555555555555555555555555555555555',
			},
		}, context)).rejects.toThrow('strategy mismatch')
		expect(getStaker).toHaveBeenCalledTimes(2)
	})
})

describe('EigenExplorer operator resolvers', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getOperator.mockReset()
		getOperatorRewardInfo.mockReset()
		getOperator.mockResolvedValue({
			address: operatorAddress,
			metadataName: 'Example Operator',
			metadataDescription: 'Restaking operator',
			metadataWebsite: 'https://example.operator',
			metadataLogo: 'https://example.operator/logo.svg',
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [{
				strategyAddress,
				shares: '42',
			}],
		})
		getOperatorRewardInfo.mockResolvedValue({
			address: operatorAddress,
			rewardTokens: [tokenAddress],
			rewardStrategies: [strategyAddress],
		})
	})

	it('projects operator identity fields from the official operator snapshot', async () => {
		const operator = await operatorResolver.resolve.NetworkOperatorAddress.resolve(
			operatorSelector,
			context
		)

		expect(operatorResolver.projections.name(operator)).toBe('Example Operator')
		expect(operatorResolver.projections.description(operator)).toBe('Restaking operator')
		expect(operatorResolver.projections.website(operator)).toBe('https://example.operator')
		expect(operatorResolver.projections.metadataUri(operator)).toBe('https://example.operator/logo.svg')
		expect(operatorResolver.projections.$operatorAccount(operator)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				$actor: {
					address: operatorAddress,
				},
			},
		})
	})

	it('keeps independently reported reward strategies and tokens in separate observations', async () => {
		const rewards = await operatorRewardsResolver.resolve.NetworkOperatorAddress.resolve(
			operatorSelector,
			context
		)

		expect(operatorRewardsResolver.projections.$$rewards(rewards)).toEqual([{
			[EntityMetaKey.Selector]: {
				$earner: {
					$network: network,
					$actor: {
						address: operatorAddress,
					},
				},
				rewardContextKey: `strategy:${strategyAddress}`,
				timestampMs,
				source: Source.EigenExplorer_Rest,
			},
			[EntityMetaKey.Fields]: {
				$strategy: {
					[EntityMetaKey.Selector]: {
						$network: network,
						strategyAddress,
					},
				},
				$operator: {
					[EntityMetaKey.Selector]: {
						$network: network,
						operatorAddress,
					},
				},
			},
		}, {
			[EntityMetaKey.Selector]: {
				$earner: {
					$network: network,
					$actor: {
						address: operatorAddress,
					},
				},
				rewardContextKey: `token:${tokenAddress}`,
				timestampMs,
				source: Source.EigenExplorer_Rest,
			},
			[EntityMetaKey.Fields]: {
				$operator: {
					[EntityMetaKey.Selector]: {
						$network: network,
						operatorAddress,
					},
				},
				rewardToken: tokenAddress,
			},
		}])
		expect(getOperator).toHaveBeenCalledWith(operatorAddress)
		expect(getOperatorRewardInfo).toHaveBeenCalledWith(operatorAddress)
	})

	it('re-resolves independently sourced strategy and token observations', async () => {
		const reward = await rewardTimestampResolver.resolve.EarnerRewardContextKeyTimestampMsSource.resolve({
			$earner: {
				$network: network,
				$actor: {
					address: operatorAddress,
				},
			},
			rewardContextKey: `strategy:${strategyAddress}`,
			timestampMs,
			source: Source.EigenExplorer_Rest,
		}, context)

		expect(rewardTimestampResolver.projections.$strategy(reward)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				strategyAddress,
			},
		})
		expect(rewardTimestampResolver.projections.$operator(reward)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				operatorAddress,
			},
		})
		expect(rewardTimestampResolver.projections.rewardToken(reward)).toBeUndefined()

		const tokenReward = await rewardTimestampResolver.resolve.EarnerRewardContextKeyTimestampMsSource.resolve({
			$earner: {
				$network: network,
				$actor: {
					address: operatorAddress,
				},
			},
			rewardContextKey: `token:${tokenAddress}`,
			timestampMs,
			source: Source.EigenExplorer_Rest,
		}, context)

		expect(rewardTimestampResolver.projections.$strategy(tokenReward)).toBeUndefined()
		expect(rewardTimestampResolver.projections.rewardToken(tokenReward)).toBe(tokenAddress)
	})

	it('fail-closes singular reward observations on timestamp or context mismatch', async () => {
		await expect(rewardTimestampResolver.resolve.EarnerRewardContextKeyTimestampMsSource.resolve({
			$earner: {
				$network: network,
				$actor: {
					address: operatorAddress,
				},
			},
			rewardContextKey: `strategy:${strategyAddress}`,
			timestampMs: timestampMs + 1,
			source: Source.EigenExplorer_Rest,
		}, context)).rejects.toThrow('reward timestamp mismatch')

		await expect(rewardTimestampResolver.resolve.EarnerRewardContextKeyTimestampMsSource.resolve({
			$earner: {
				$network: network,
				$actor: {
					address: operatorAddress,
				},
			},
			rewardContextKey: 'token:0x9999999999999999999999999999999999999999',
			timestampMs,
			source: Source.EigenExplorer_Rest,
		}, context)).rejects.toThrow('reward context mismatch')
	})
})

describe('EigenExplorer AVS resolvers', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getAvs.mockReset()
		listAvsOperators.mockReset()
		getAvs.mockResolvedValue({
			address: avsAddress,
			metadataName: 'Example AVS',
			metadataDescription: 'Restaking AVS',
			metadataWebsite: 'https://example.avs',
			metadataLogo: 'https://example.avs/logo.svg',
			totalStakers: 12,
			totalOperators: 3,
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [{
				strategyAddress,
				shares: '42',
			}, {
				strategyAddress: '0x5555555555555555555555555555555555555555',
				shares: '7',
			}],
		})
		listAvsOperators.mockResolvedValue({
			data: [{
				address: operatorAddress,
				metadataName: 'Example Operator',
				metadataDescription: null,
				metadataWebsite: null,
				metadataLogo: null,
				createdAtBlock: '100',
				updatedAtBlock: '101',
				createdAt: '2026-01-01T00:00:00.000Z',
				updatedAt: '2026-01-02T00:00:00.000Z',
				shares: [{
					strategyAddress,
					shares: '42',
				}],
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
	})

	it('projects AVS identity fields from the official AVS snapshot', async () => {
		const avs = await avsResolver.resolve.NetworkAvsAddress.resolve(
			avsSelector,
			context
		)

		expect(avsResolver.projections.name(avs)).toBe('Example AVS')
		expect(avsResolver.projections.description(avs)).toBe('Restaking AVS')
		expect(avsResolver.projections.website(avs)).toBe('https://example.avs')
		expect(avsResolver.projections.metadataUri(avs)).toBe('https://example.avs/logo.svg')
		expect(avsResolver.projections.$avsAccount(avs)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				$actor: {
					address: avsAddress,
				},
			},
		})
	})

	it('projects AVS observation and operator rows at the update clock', async () => {
		const timestamps = await avsTimestampsResolver.resolve.NetworkAvsAddress.resolve(
			avsSelector,
			context
		)

		expect(avsTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([{
			[EntityMetaKey.Selector]: {
				$avs: {
					[EntityMetaKey.Selector]: {
						$network: network,
						avsAddress,
					},
				},
				timestampMs,
				source: Source.EigenExplorer_Rest,
			},
		}])

		const operators = await avsOperatorsResolver.resolve.NetworkAvsAddress.resolve(
			avsSelector,
			context
		)

		expect(avsOperatorsResolver.projections.$$operators.select(operators)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				operatorAddress,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EigenLayerOperator, [], 'name')]: 'Example Operator',
				[entityFieldAddressKey(EntityType.EigenLayerOperator, [], '$operatorAccount')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						$actor: {
							address: operatorAddress,
						},
					},
				},
			},
		}])
		expect(listAvsOperators).toHaveBeenCalledWith(avsAddress, {
			skip: 0,
			take: 64,
		})
	})

	it('projects AVS timestamp metrics and rejects clock mismatch', async () => {
		const timestamp = await avsTimestampResolver.resolve.AvsTimestampMsSource.resolve(
			avsTimestampSelector,
			context
		)

		expect(avsTimestampResolver.projections.blockNumber(timestamp)).toBe(101n)
		expect(avsTimestampResolver.projections.operatorCount(timestamp)).toBe(3)
		expect(avsTimestampResolver.projections.strategyCount(timestamp)).toBe(2)

		await expect(avsTimestampResolver.resolve.AvsTimestampMsSource.resolve({
			...avsTimestampSelector,
			timestampMs: timestampMs + 1,
		}, context)).rejects.toThrow('timestamp mismatch')
	})
})

describe('EigenExplorer allocation and slash resolvers', () => {
	const allocationUpdatedAt = '2025-02-01T00:00:00.000Z'
	const allocation = {
		avsAddress,
		operatorSetId: 0,
		operatorAddress,
		strategyAddress,
		magnitude: '100000',
		effectBlock: 3326552,
		createdAt: allocationUpdatedAt,
		createdAtBlock: 3325343,
		updatedAt: allocationUpdatedAt,
		updatedAtBlock: 3325343,
	}
	const slash = {
		avsAddress,
		operatorSetId: 0,
		operatorAddress,
		strategies: [strategyAddress],
		wadSlashed: ['900719925474099312345'],
		description: 'temp',
		createdAt: allocationUpdatedAt,
		createdAtBlock: 3325343,
		updatedAt: allocationUpdatedAt,
		updatedAtBlock: 3325343,
	}

	beforeEach(() => {
		vi.restoreAllMocks()
		getStrategyTvl.mockReset()
		listOperatorAllocations.mockReset()
		listAvsAllocations.mockReset()
		listOperatorSlashes.mockReset()
		listAvsSlashes.mockReset()
		getStrategyTvl.mockResolvedValue({
			tvl: 12.5,
			tvlEth: 10,
		})
		listOperatorAllocations.mockResolvedValue({
			data: [allocation],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		listAvsAllocations.mockResolvedValue({
			data: [allocation],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		listOperatorSlashes.mockResolvedValue({
			data: [slash],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		listAvsSlashes.mockResolvedValue({
			data: [slash],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
	})

	it('projects strategy contract identity after TVL existence check', async () => {
		const strategy = await strategyResolver.resolve.NetworkStrategyAddress.resolve({
			$network: network,
			strategyAddress,
		}, context)

		expect(strategyResolver.projections.$strategyContract(strategy)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: strategyAddress,
			},
		})
		expect(getStrategyTvl).toHaveBeenCalledWith(strategyAddress)
	})

	it('projects operator and AVS allocation rows with authoritative counts', async () => {
		const operatorAllocations = await operatorAllocationsResolver.resolve.NetworkOperatorAddress.resolve(
			operatorSelector,
			context
		)
		expect(operatorAllocationsResolver.projections.$$allocations.select(operatorAllocations)).toEqual([{
			[EntityMetaKey.Selector]: {
				$operator: {
					$network: network,
					operatorAddress,
				},
				$avs: {
					$network: network,
					avsAddress,
				},
				$strategy: {
					$network: network,
					strategyAddress,
				},
				timestampMs: Date.parse(allocationUpdatedAt),
				source: Source.EigenExplorer_Rest,
			},
		}])
		expect(operatorAllocationsResolver.projections.$$allocations.resolveCount(operatorAllocations)).toBe(1)

		const avsAllocations = await avsAllocationsResolver.resolve.NetworkAvsAddress.resolve(
			avsSelector,
			context
		)
		expect(avsAllocationsResolver.projections.$$allocations.select(avsAllocations)).toHaveLength(1)
	})

	it('projects allocation observation fields, pages filtered lookup, and maps AVS registration status', async () => {
		getOperator.mockResolvedValue({
			address: operatorAddress,
			metadataName: 'Example Operator',
			metadataDescription: null,
			metadataWebsite: null,
			metadataLogo: null,
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: allocationUpdatedAt,
			shares: [{
				strategyAddress,
				shares: '42',
			}],
			avsRegistrations: [{
				avsAddress,
				isActive: true,
			}],
		})
		listOperatorAllocations
			.mockResolvedValueOnce({
				data: [{
					...allocation,
					strategyAddress: tokenAddress,
					updatedAt: '2024-01-01T00:00:00.000Z',
				}],
				meta: {
					total: 2,
					skip: 0,
					take: 100,
				},
			})
			.mockResolvedValueOnce({
				data: [allocation],
				meta: {
					total: 2,
					skip: 1,
					take: 100,
				},
			})

		const observation = await allocationTimestampResolver.resolve.OperatorAvsStrategyTimestampMsSource.resolve({
			$operator: {
				$network: network,
				operatorAddress,
			},
			$avs: {
				$network: network,
				avsAddress,
			},
			$strategy: {
				$network: network,
				strategyAddress,
			},
			timestampMs: Date.parse(allocationUpdatedAt),
			source: Source.EigenExplorer_Rest,
		}, context)

		expect(allocationTimestampResolver.projections.allocationMagnitude(observation)).toBe(100000)
		expect(allocationTimestampResolver.projections.operatorSetId(observation)).toBe('0')
		expect(allocationTimestampResolver.projections.registrationStatus(observation)).toBe('active')
		expect(listOperatorAllocations).toHaveBeenNthCalledWith(1, operatorAddress, {
			skip: 0,
			take: 100,
			avsAddress,
			strategyAddress,
		})
		expect(listOperatorAllocations).toHaveBeenNthCalledWith(2, operatorAddress, {
			skip: 1,
			take: 100,
			avsAddress,
			strategyAddress,
		})
		expect(getOperator).toHaveBeenCalledWith(operatorAddress, {
			withAvsData: true,
		})

		await expect(allocationTimestampResolver.resolve.OperatorAvsStrategyTimestampMsSource.resolve({
			$operator: {
				$network: network,
				operatorAddress,
			},
			$avs: {
				$network: network,
				avsAddress,
			},
			$strategy: {
				$network: network,
				strategyAddress,
			},
			timestampMs: Date.parse(allocationUpdatedAt) + 1,
			source: Source.EigenExplorer_Rest,
		}, context)).rejects.toThrow('allocation observation mismatch')
	})

	it('projects slash rows and singular OperatorAvsSourceSlashId fields', async () => {
		const operatorSlashes = await operatorSlashesResolver.resolve.NetworkOperatorAddress.resolve(
			operatorSelector,
			context
		)
		const slashId = `0:3325343:${strategyAddress}`
		expect(operatorSlashesResolver.projections.$$slashingEvents.select(operatorSlashes)).toEqual([{
			[EntityMetaKey.Selector]: {
				$operator: {
					$network: network,
					operatorAddress,
				},
				$avs: {
					$network: network,
					avsAddress,
				},
				source: Source.EigenExplorer_Rest,
				slashId,
			},
		}])

		const avsSlashes = await avsSlashesResolver.resolve.NetworkAvsAddress.resolve(
			avsSelector,
			context
		)
		expect(avsSlashesResolver.projections.$$slashingEvents.select(avsSlashes)).toHaveLength(1)

		const slashEvent = await slashEventResolver.resolve.OperatorAvsSourceSlashId.resolve({
			$operator: {
				$network: network,
				operatorAddress,
			},
			$avs: {
				$network: network,
				avsAddress,
			},
			source: Source.EigenExplorer_Rest,
			slashId,
		}, context)

		expect(slashEventResolver.projections.slashedShares(slashEvent)).toBe(900719925474099312345n)
		expect(slashEventResolver.projections.reason(slashEvent)).toBe('temp')
		expect(slashEventResolver.projections.blockNumber(slashEvent)).toBe(3325343n)
	})

	it('rejects unpaired, lossy, or negative slash evidence before materialization', async () => {
		listOperatorSlashes.mockResolvedValueOnce({
			data: [{
				...slash,
				wadSlashed: [],
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})

		await expect(operatorSlashesResolver.resolve.NetworkOperatorAddress.resolve(
			operatorSelector,
			context
		)).rejects.toThrow('slash strategy and quantity counts differ')

		listOperatorSlashes.mockResolvedValueOnce({
			data: [{
				...slash,
				createdAtBlock: -1,
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})

		await expect(operatorSlashesResolver.resolve.NetworkOperatorAddress.resolve(
			operatorSelector,
			context
		)).rejects.toThrow('slash coordinates not safe nonnegative integers')

		listOperatorSlashes.mockResolvedValueOnce({
			data: [{
				...slash,
				wadSlashed: ['-1'],
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})

		await expect(operatorSlashesResolver.resolve.NetworkOperatorAddress.resolve(
			operatorSelector,
			context
		)).rejects.toThrow('slash wad not a nonnegative integer')
	})

	it('rejects a foreign operator with an otherwise matching slash identity', async () => {
		const slashId = `0:3325343:${strategyAddress}`
		listOperatorSlashes.mockResolvedValueOnce({
			data: [{
				...slash,
				operatorAddress: '0x5555555555555555555555555555555555555555',
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})

		await expect(slashEventResolver.resolve.OperatorAvsSourceSlashId.resolve({
			$operator: {
				$network: network,
				operatorAddress,
			},
			$avs: {
				$network: network,
				avsAddress,
			},
			source: Source.EigenExplorer_Rest,
			slashId,
		}, context)).rejects.toThrow('slash observation mismatch')
	})

	it('pages singular slash lookup beyond the first operator slash page', async () => {
		const slashId = `0:3325343:${strategyAddress}`
		listOperatorSlashes
			.mockResolvedValueOnce({
				data: [{
					...slash,
					createdAtBlock: 1,
					strategies: ['0x5555555555555555555555555555555555555555'],
					wadSlashed: ['1'],
				}],
				meta: {
					total: 2,
					skip: 0,
					take: 100,
				},
			})
			.mockResolvedValueOnce({
				data: [slash],
				meta: {
					total: 2,
					skip: 1,
					take: 100,
				},
			})

		const slashEvent = await slashEventResolver.resolve.OperatorAvsSourceSlashId.resolve({
			$operator: {
				$network: network,
				operatorAddress,
			},
			$avs: {
				$network: network,
				avsAddress,
			},
			source: Source.EigenExplorer_Rest,
			slashId,
		}, context)

		expect(slashEventResolver.projections.slashId(slashEvent)).toBe(slashId)
		expect(listOperatorSlashes).toHaveBeenNthCalledWith(1, operatorAddress, {
			skip: 0,
			take: 100,
		})
		expect(listOperatorSlashes).toHaveBeenNthCalledWith(2, operatorAddress, {
			skip: 1,
			take: 100,
		})
	})
})

describe('EigenExplorer protocol hub catalog resolvers', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		listOperators.mockReset()
		listAvss.mockReset()
		listStrategies.mockReset()
		listOperators.mockResolvedValue({
			data: [{
				address: operatorAddress,
				metadataName: 'Example Operator',
				metadataDescription: null,
				metadataWebsite: null,
				metadataLogo: null,
				createdAtBlock: '100',
				updatedAtBlock: '101',
				createdAt: '2026-01-01T00:00:00.000Z',
				updatedAt: '2026-01-02T00:00:00.000Z',
				shares: [{
					strategyAddress,
					shares: '42',
				}],
			}],
			meta: {
				total: 40,
				skip: 0,
				take: 100,
			},
		})
		listAvss.mockResolvedValue({
			data: [{
				address: avsAddress,
				metadataName: 'Example AVS',
				metadataDescription: null,
				metadataWebsite: null,
				metadataLogo: null,
				totalStakers: 12,
				totalOperators: 3,
				createdAtBlock: '100',
				updatedAtBlock: '101',
				createdAt: '2026-01-01T00:00:00.000Z',
				updatedAt: '2026-01-02T00:00:00.000Z',
				shares: [{
					strategyAddress,
					shares: '42',
				}],
			}],
			meta: {
				total: 18,
				skip: 0,
				take: 100,
			},
		})
		listStrategies.mockResolvedValue({
			data: [{
				strategyAddress,
				tokens: [tokenAddress],
			}],
			meta: {
				total: 3,
				skip: 0,
				take: 100,
			},
		})
	})

	it('projects protocol $$operators / $$avss / $$strategies with counts and continuation', async () => {
		const operators = await protocolOperatorsResolver.resolve.Network.resolve(
			protocolSelector,
			context
		)
		expect(protocolOperatorsResolver.projections.$$operators.select(operators)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				operatorAddress,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EigenLayerOperator, [], 'name')]: 'Example Operator',
				[entityFieldAddressKey(EntityType.EigenLayerOperator, [], '$operatorAccount')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						$actor: {
							address: operatorAddress,
						},
					},
				},
			},
		}])
		expect(protocolOperatorsResolver.projections.$$operators.resolveCount(operators)).toBe(40)
		expect(protocolOperatorsResolver.projections.$$operators.continuation(operators)).toEqual({
			operation: 'protocol-operators',
			target: 'eigen-explorer',
			terminal: false,
			token: '1',
		})

		const avss = await protocolAvssResolver.resolve.Network.resolve(
			protocolSelector,
			context
		)
		expect(protocolAvssResolver.projections.$$avss.select(avss)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				avsAddress,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EigenLayerAvs, [], 'name')]: 'Example AVS',
				[entityFieldAddressKey(EntityType.EigenLayerAvs, [], '$avsAccount')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						$actor: {
							address: avsAddress,
						},
					},
				},
			},
		}])
		expect(protocolAvssResolver.projections.$$avss.resolveCount(avss)).toBe(18)

		const strategies = await protocolStrategiesResolver.resolve.Network.resolve(
			protocolSelector,
			context
		)
		expect(protocolStrategiesResolver.projections.$$strategies.select(strategies)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				strategyAddress,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EigenLayerStrategy, [], '$strategyContract')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: strategyAddress,
					},
				},
			},
		}])
		expect(protocolStrategiesResolver.projections.$$strategies.resolveCount(strategies)).toBe(3)
		expect(listStrategies).toHaveBeenCalledWith({
			skip: 0,
			take: 64,
		})
	})
})
