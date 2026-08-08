import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Allium/bindings.ts'
import { Source } from '$/sources/Source.ts'

const {
	alliumFetch,
} = vi.hoisted(() => ({
	alliumFetch: vi.fn(),
}))

vi.mock('$/sources/Allium/Rest/client.ts', () => ({
	alliumFetch,
}))

const {
	getLatestWalletBalances,
	getTokensByChainAddress,
} = await import('$/sources/Allium/Rest/queries.ts')

const publicEnv = {
	PUBLIC_ALLIUM_API_KEY: 'test-key',
}
const address = '0x1111111111111111111111111111111111111111'
const tokenAddress = '0x2222222222222222222222222222222222222222'
const binding = bindings[Source.Allium_Rest][0]

beforeEach(() => {
	vi.clearAllMocks()
})

describe('Allium wallet balance envelopes', () => {
	it('passes only the caller-provided noncanonical binding to transport', async () => {
		const modifiedBinding = {
			...binding,
			endpoints: binding.endpoints.map((endpoint) => ({
				...endpoint,
				locator: 'https://noncanonical.example/allium',
			})),
		}
		alliumFetch.mockResolvedValueOnce({ items: [] })

		await getLatestWalletBalances({
			binding: modifiedBinding,
			publicEnv,
			address,
			apiChain: 'ethereum',
		})

		expect(alliumFetch).toHaveBeenCalledOnce()
		expect(alliumFetch.mock.calls[0][0]).toBe(modifiedBinding)
	})

	it('accepts tip balance rows and forwards optional cursor', async () => {
		alliumFetch.mockResolvedValueOnce({
			items: [{
				chain: 'ethereum',
				address,
				raw_balance_str: '1000',
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
			}],
			cursor: 'next-page',
		})

		await expect(getLatestWalletBalances({
			binding,
			publicEnv,
			address,
			apiChain: 'ethereum',
			cursor: 'page-1',
		})).resolves.toMatchObject({
			cursor: 'next-page',
			items: [{
				raw_balance_str: '1000',
			}],
		})
		expect(alliumFetch).toHaveBeenCalledWith(
			binding,
			publicEnv,
			'/api/v1/developer/wallet/balances?with_liquidity_info=false&cursor=page-1',
			{
				method: 'POST',
				body: JSON.stringify([
					{
						address,
						chain: 'ethereum',
					},
				]),
			}
		)
		expect(binding.source).toBe(Source.Allium_Rest)
	})

	it('fail-closes invalid raw_balance_str and oversized pages', async () => {
		alliumFetch.mockResolvedValueOnce({
			items: [{
				chain: 'ethereum',
				address,
				raw_balance_str: '1.5',
				token: {
					chain: 'ethereum',
					address: 'native',
					type: 'native',
					decimals: 18,
					info: {
						name: 'Ether',
						symbol: 'ETH',
					},
				},
			}],
		})
		await expect(getLatestWalletBalances({
			binding,
			publicEnv,
			address,
			apiChain: 'ethereum',
		})).rejects.toThrow('invalid wallet balances response envelope')

		alliumFetch.mockResolvedValueOnce({
			items: Array.from({
				length: 5_001,
			}, () => ({
				chain: 'ethereum',
				address,
				raw_balance_str: '1',
			})),
		})
		await expect(getLatestWalletBalances({
			binding,
			publicEnv,
			address,
			apiChain: 'ethereum',
		})).rejects.toThrow('invalid wallet balances response envelope')
	})

	it('rejects invalid wallet addresses before transport', async () => {
		await expect(getLatestWalletBalances({
			binding,
			publicEnv,
			address: 'not-an-address',
			apiChain: 'ethereum',
		})).rejects.toThrow('invalid wallet address')
		expect(alliumFetch).not.toHaveBeenCalled()
	})
})

describe('Allium tokens-by-address envelopes', () => {
	it('accepts token metadata and fail-closes empty error rows', async () => {
		alliumFetch.mockResolvedValueOnce([
			{
				chain: 'ethereum',
				address: tokenAddress,
				decimals: 6,
				info: {
					name: 'USD Coin',
					symbol: 'USDC',
				},
			},
		])
		await expect(getTokensByChainAddress({
			binding,
			publicEnv,
			apiChain: 'ethereum',
			tokenAddress,
		})).resolves.toEqual([
			{
				chain: 'ethereum',
				address: tokenAddress,
				decimals: 6,
				info: {
					name: 'USD Coin',
					symbol: 'USDC',
				},
			},
		])

		alliumFetch.mockResolvedValueOnce([
			{
				error: '',
				address: tokenAddress,
				chain: 'ethereum',
			},
		])
		await expect(getTokensByChainAddress({
			binding,
			publicEnv,
			apiChain: 'ethereum',
			tokenAddress,
		})).rejects.toThrow('invalid tokens-by-address response envelope')
	})
})
