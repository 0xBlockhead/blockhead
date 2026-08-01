import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { Source } from '$/sources/Source.ts'

const getStaker = vi.hoisted(() => vi.fn())

vi.mock('$/sources/EigenExplorer/Rest/queries.ts', () => ({
	getStaker,
}))

const { default: eigenExplorerResolvers } = await import('$/resolvers/EigenExplorer-Rest.ts')

const resolver = eigenExplorerResolvers.resolvers[0]
const stakerAddress = '0x1111111111111111111111111111111111111111'
const operatorAddress = '0x2222222222222222222222222222222222222222'
const strategyAddress = '0x3333333333333333333333333333333333333333'
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
	})

	it('projects the current delegated shares from the exact official staker snapshot', async () => {
		const delegation = await resolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve(
			selector,
			context
		)

		expect(resolver.projections.delegatedShares(delegation)).toBe(900719925474099312345n)
		expect(getStaker).toHaveBeenCalledOnce()
		expect(getStaker).toHaveBeenCalledWith(stakerAddress)
	})

	it('rejects non-mainnet selectors before transport', async () => {
		await expect(resolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve({
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
		await expect(resolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve(
			selector,
			context
		)).rejects.toThrow('operator mismatch')

		await expect(resolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve({
			...selector,
			source: Source.EigenLayerContracts_Evm,
		}, context)).rejects.toThrow('source mismatch')
		expect(getStaker).toHaveBeenCalledOnce()
	})

	it('rejects snapshots whose strategy or timestamp does not match', async () => {
		await expect(resolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve({
			...selector,
			timestampMs: timestampMs + 1,
		}, context)).rejects.toThrow('timestamp mismatch')

		await expect(resolver.resolve.StakerOperatorStrategyTimestampMsSource.resolve({
			...selector,
			$strategy: {
				...selector.$strategy,
				strategyAddress: '0x5555555555555555555555555555555555555555',
			},
		}, context)).rejects.toThrow('strategy mismatch')
		expect(getStaker).toHaveBeenCalledTimes(2)
	})
})
