import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

const getAvs = vi.hoisted(() => vi.fn())
const getOperator = vi.hoisted(() => vi.fn())
const getOperatorRewardInfo = vi.hoisted(() => vi.fn())
const listAvsOperators = vi.hoisted(() => vi.fn())
const getStaker = vi.hoisted(() => vi.fn())
const getStakerDeposits = vi.hoisted(() => vi.fn())
const getStakerWithdrawals = vi.hoisted(() => vi.fn())

vi.mock('$/sources/EigenExplorer/Rest/queries.ts', () => ({
	getAvs,
	getOperator,
	getOperatorRewardInfo,
	listAvsOperators,
	getStaker,
	getStakerDeposits,
	getStakerWithdrawals,
}))

const { default: eigenExplorerResolvers } = await import('$/resolvers/EigenExplorer-Rest.ts')

const [
	delegationResolver,
	operatorResolver,
	operatorRewardsResolver,
	avsResolver,
	avsTimestampsResolver,
	avsOperatorsResolver,
	avsTimestampResolver,
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

	it('projects reward strategy/token observations at the operator update clock', async () => {
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
				rewardContextKey: `${strategyAddress}:${tokenAddress}`,
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
				rewardToken: tokenAddress,
			},
		}])
		expect(getOperator).toHaveBeenCalledWith(operatorAddress)
		expect(getOperatorRewardInfo).toHaveBeenCalledWith(operatorAddress)
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
