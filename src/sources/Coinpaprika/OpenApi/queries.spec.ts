import { afterEach, describe, expect, it, vi } from 'vitest'

import { getCoins } from '$/resolvers/Coinpaprika/OpenApi/queries.ts'

describe('Coinpaprika coin queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('loads the coin catalog through the registered browser proxy transport', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify([
			{
				id: 'eth-ethereum',
				name: 'Ethereum',
				symbol: 'ETH',
			},
		]), {
			headers: {
				'content-type': 'application/json',
			},
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getCoins({
			publicEnv: {},
		})).resolves.toEqual([
			{
				id: 'eth-ethereum',
				name: 'Ethereum',
				symbol: 'ETH',
			},
		])
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining(encodeURIComponent('https://api.coinpaprika.com/v1/coins')),
			expect.objectContaining({
				headers: {
					Accept: 'application/json',
				},
			})
		)
	})
})
