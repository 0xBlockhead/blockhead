import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const {
	getClearinghouseState,
	getHistoricalOrders,
	getSpotClearinghouseState,
	getUserFillsByTime,
	getUserVaultEquities,
} = await import('$/sources/Hyperliquid/Rest/queries.ts')

const restBaseUrl = 'https://api.hyperliquid.xyz/'

describe('Hyperliquid public account Info transport', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		})
	})

	it.each([
		{
			query: () => getClearinghouseState({
				restBaseUrl,
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'clearinghouseState',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getSpotClearinghouseState({
				restBaseUrl,
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'spotClearinghouseState',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getHistoricalOrders({
				restBaseUrl,
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'historicalOrders',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
		{
			query: () => getUserFillsByTime({
				restBaseUrl,
				user: '0x1111111111111111111111111111111111111111',
				startTime: 1_700_000_000_000,
				endTime: 1_700_086_400_000,
			}),
			body: {
				type: 'userFillsByTime',
				user: '0x1111111111111111111111111111111111111111',
				startTime: 1_700_000_000_000,
				endTime: 1_700_086_400_000,
				aggregateByTime: false,
			},
		},
		{
			query: () => getUserVaultEquities({
				restBaseUrl,
				user: '0x1111111111111111111111111111111111111111',
			}),
			body: {
				type: 'userVaultEquities',
				user: '0x1111111111111111111111111111111111111111',
			},
		},
	])('posts the exact read-only Info request body', async ({ query, body }) => {
		await query()

		expect(corsFetch).toHaveBeenCalledWith(
			'https://api.hyperliquid.xyz/info',
			expect.objectContaining({
				init: expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(body),
				}),
			})
		)
	})

	it.each([
		{ startTime: -1 },
		{ startTime: 1.5 },
		{ startTime: 10, endTime: 9 },
		{ startTime: 10, endTime: Number.MAX_SAFE_INTEGER + 1 },
	])('rejects invalid fill windows before transport', ({ startTime, endTime }) => {
		expect(() => getUserFillsByTime({
			restBaseUrl,
			user: '0x1111111111111111111111111111111111111111',
			startTime,
			...(endTime != null && { endTime }),
		})).toThrow('Hyperliquid_Rest: invalid fill')
		expect(corsFetch).not.toHaveBeenCalled()
	})
})
