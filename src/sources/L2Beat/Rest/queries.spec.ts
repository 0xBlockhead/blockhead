import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { scalingSummaryPath } from '$/sources/L2Beat/Rest/constants.ts'
import { fetchScalingSummary } from '$/sources/L2Beat/Rest/queries.ts'

describe('L2Beat scaling summary query', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes through the browser proxy and strips undeclared project keys', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
			projects: {
				arbitrum: {
					id: 'arbitrum',
					name: 'Arbitrum One',
					slug: 'arbitrum',
					type: 'layer2',
					hostChain: 'Ethereum',
					category: 'Optimistic Rollup',
					providers: ['Arbitrum'],
					tvs: { breakdown: { total: 1 } },
				},
			},
			chart: {
				syncedUntil: 1_785_830_400,
				types: ['timestamp'],
				data: [[1]],
			},
		})))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(fetchScalingSummary()).resolves.toEqual({
			projects: {
				arbitrum: {
					id: 'arbitrum',
					name: 'Arbitrum One',
					slug: 'arbitrum',
					type: 'layer2',
					hostChain: 'Ethereum',
					category: 'Optimistic Rollup',
				},
			},
			chart: {
				syncedUntil: 1_785_830_400,
			},
		})
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp(`^/api-proxy/.+/0/https%3A%2F%2Fl2beat\\.com${scalingSummaryPath.replaceAll('/', '%2F')}$`)),
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})

	it('hard-fails non-success HTTP responses', async () => {
		vi.stubGlobal('window', {})
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(new Response('missing', { status: 404 }))
			.mockResolvedValueOnce(new Response('upstream', { status: 500 }))
		vi.stubGlobal('fetch', fetchMock)

		await expect(fetchScalingSummary()).rejects.toThrow(/404/)
		await expect(fetchScalingSummary()).rejects.toThrow(/500/)
	})

	it('fail-closes invalid scaling summary envelopes', async () => {
		vi.stubGlobal('window', {})
		vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
			projects: {
				broken: {
					id: 'broken',
					name: 'Broken',
					slug: 'broken',
					type: 'layer2',
				},
			},
			chart: {
				syncedUntil: 1_785_830_400,
			},
		}))))

		await expect(fetchScalingSummary()).rejects.toThrow('L2Beat_Rest: invalid scaling summary response envelope')
	})
})
