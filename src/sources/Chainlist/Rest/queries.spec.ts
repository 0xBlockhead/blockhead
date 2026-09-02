import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const sourceFetch = vi.hoisted(() => vi.fn())
const firstHttpUrlForBinding = vi.hoisted(() => vi.fn(() => 'https://chainlist.org'))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding,
	sourceFetch,
}))

const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')

const chain = {
	name: 'Ethereum Mainnet',
	chain: 'ETH',
	chainId: 1,
	nativeCurrency: {
		name: 'Ether',
		symbol: 'ETH',
		decimals: 18,
	},
}

describe('Chainlist REST queries', () => {
	beforeEach(() => {
		firstHttpUrlForBinding.mockClear()
		sourceFetch.mockReset()
	})

	it('fetches and validates the chain identity fields', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify([chain])))

		await expect(fetchRpcsJson()).resolves.toEqual([chain])
		expect(firstHttpUrlForBinding).toHaveBeenCalledOnce()
		expect(sourceFetch).toHaveBeenCalledWith(
			expect.anything(),
		'https://chainlist.org/rpcs.json',
		{ cache: 'no-store' }
		)
	})

	it('fails closed when the response does not identify a chain', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify([{
			name: 'Ethereum Mainnet',
			nativeCurrency: chain.nativeCurrency,
		}])))

		await expect(fetchRpcsJson()).rejects.toThrow('Chainlist_Rest: invalid rpcs.json response envelope')
	})

	it('fails closed when the response aliases two rows to one chain identity', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify([
			chain,
			{
				...chain,
				name: 'Conflicting Ethereum Mainnet',
			},
		])))

		await expect(fetchRpcsJson()).rejects.toThrow('Chainlist_Rest: duplicate chain identity 1')
	})
})
