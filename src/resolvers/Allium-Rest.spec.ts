import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getLatestWalletBalances = vi.hoisted(() => vi.fn())
const getTokensByChainAddress = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Allium/Rest/queries.ts', () => ({
	getLatestWalletBalances,
	getTokensByChainAddress,
}))

const { default: alliumRest } = await import('$/resolvers/Allium-Rest.ts')

const address = '0x1111111111111111111111111111111111111111'
const tokenAddress = '0x2222222222222222222222222222222222222222'
const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
} as const
const emptyContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const nativeBalanceRow = {
	chain: 'ethereum',
	address,
	raw_balance_str: '1000000000000000000',
	block_timestamp: '2026-01-01T00:00:00.000Z',
	block_number: 22_800_000,
	token: {
		chain: 'ethereum',
		address: 'native',
		type: 'native',
		price: 3200,
		decimals: 18,
		info: {
			name: 'Ether',
			symbol: 'ETH',
		},
	},
}

const balanceResolver = alliumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkActorCoinBalance
	&& '$$timestamps' in resolver.projections
))
const balanceTimestampResolver = alliumRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkActorCoinBalance_Timestamp
))

if (balanceResolver == null || balanceTimestampResolver == null)
	throw new Error('Allium_Rest spec missing balance observation resolvers')

describe('Allium_Rest balance observations', () => {
	beforeEach(() => {
		getLatestWalletBalances.mockReset()
		getTokensByChainAddress.mockReset()
	})

	it('projects enrolled tip balance observations onto native holdings', async () => {
		getLatestWalletBalances.mockResolvedValue({
			items: [nativeBalanceRow],
		})

		const snapshot = await balanceResolver.resolve.EvmAccountNativeCoinInstance.resolve({
			$actor: {
				address,
			},
			$network: network,
		}, emptyContext)

		expect(snapshot).toMatchObject({
			symbol: 'ETH',
			decimals: 18,
			$coinInstance: {
				[EntityMetaKey.Selector]: {
					type: CoinInstanceType.NativeCurrency,
				},
			},
		})
		expect(balanceResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$actorCoin: {
					$actor: {
						address,
					},
					$network: network,
				},
				timestampMs: Date.parse('2026-01-01T00:00:00.000Z'),
				source: Source.Allium_Rest,
			},
		}])

		const observation = await balanceTimestampResolver.resolve.ActorCoinTimestampMsSource.resolve({
			$actorCoin: {
				$actor: {
					address,
				},
				$network: network,
			},
			timestampMs: Date.parse('2026-01-01T00:00:00.000Z'),
			source: Source.Allium_Rest,
		}, emptyContext)

		expect(balanceTimestampResolver.projections.balance(observation)).toBe(1_000_000_000_000_000_000n)
		expect(balanceTimestampResolver.projections.blockNumber(observation)).toBe(22_800_000n)
		expect(balanceTimestampResolver.projections.priceUsd(observation)).toBe(3200)
		expect(balanceTimestampResolver.projections.usdValue(observation)).toBe(3200)
	})

	it('paginates owned coins through Allium balance cursors', async () => {
		const ownedCoinsResolver = alliumRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmNetworkAccount
			&& '$$ownedCoins' in resolver.projections
		))
		if (ownedCoinsResolver == null || typeof ownedCoinsResolver.projections.$$ownedCoins === 'function')
			throw new Error('Allium_Rest spec missing owned-coins continuation')

		getLatestWalletBalances.mockResolvedValue({
			items: [nativeBalanceRow],
			cursor: 'cursor-2',
		})

		const page = await ownedCoinsResolver.resolve.EvmNetworkEvmAccount.resolve({
			$actor: {
				address,
			},
			$network: network,
		}, emptyContext)

		expect(ownedCoinsResolver.projections.$$ownedCoins.select(page)).toEqual([{
			[EntityMetaKey.Selector]: {
				$actor: {
					address,
				},
				$network: network,
			},
		}])
		expect(ownedCoinsResolver.projections.$$ownedCoins.continuation?.(page)).toEqual({
			operation: 'account-owned-coins',
			target: 'allium',
			terminal: false,
			token: 'cursor-2',
		})
	})

	it('hard-fails incomplete balance clocks instead of soft-emptying', async () => {
		getLatestWalletBalances.mockResolvedValue({
			items: [{
				...nativeBalanceRow,
				block_timestamp: undefined,
			}],
		})

		await expect(balanceResolver.resolve.EvmAccountNativeCoinInstance.resolve({
			$actor: {
				address,
			},
			$network: network,
		}, emptyContext)).rejects.toThrow('wallet token balance timestamp missing')
	})

	it('rejects ERC-20 observation requests for missing token rows', async () => {
		getLatestWalletBalances.mockResolvedValue({
			items: [nativeBalanceRow],
		})

		await expect(balanceTimestampResolver.resolve.ActorCoinTimestampMsSource.resolve({
			$actorCoin: {
				$actor: {
					address,
				},
				$contract: {
					$network: network,
					address: tokenAddress,
				},
			},
			timestampMs: Date.parse('2026-01-01T00:00:00.000Z'),
			source: Source.Allium_Rest,
		}, emptyContext)).rejects.toThrow('balance observation missing')
	})
})
