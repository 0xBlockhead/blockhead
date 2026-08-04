import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/L2Beat/bindings.ts'
import { scalingSummaryPath } from '$/sources/L2Beat/Rest/constants.ts'
import { fetchScalingSummary } from '$/sources/L2Beat/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const l2BeatRestBinding = bindings[Source.L2Beat_Rest][0]

describe('L2Beat scaling summary query', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes through the registered browser HTTP proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
			projects: {},
			chart: {
				syncedUntil: 1_785_830_400,
			},
		})))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(fetchScalingSummary()).resolves.toMatchObject({
			chart: {
				syncedUntil: 1_785_830_400,
			},
		})
		expect(l2BeatRestBinding.endpoints[0]?.locator).toBe('https://l2beat.com')
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
	})})
