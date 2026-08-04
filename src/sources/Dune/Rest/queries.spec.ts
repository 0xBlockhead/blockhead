import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	executeQuery,
	getExecutionResults,
	getLatestQueryResults,
	getQuery,
	getUsage,
	readUsageCredits,
} from '$/sources/Dune/Rest/queries.ts'

const publicEnv = {
	PUBLIC_DUNE_API_KEY: 'test-dune-key',
}

const jsonResponse = (body: unknown, status = 200) => (
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('Dune REST queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes query metadata, execute, results, latest results, and usage through the proxy', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({ query_id: 42, name: 'demo' }))
			.mockResolvedValueOnce(jsonResponse({
				execution_id: 'exec-1',
				state: 'QUERY_STATE_PENDING',
			}))
			.mockResolvedValueOnce(jsonResponse({
				execution_id: 'exec-1',
				state: 'QUERY_STATE_COMPLETED',
				result: { rows: [{ a: 1 }] },
			}))
			.mockResolvedValueOnce(jsonResponse({
				execution_id: 'exec-2',
				state: 'QUERY_STATE_COMPLETED',
				result: { rows: [{ b: 2 }] },
			}))
			.mockResolvedValueOnce(jsonResponse({
				billingPeriods: [{ credits_used: 3, credits_included: 100 }],
			}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getQuery(publicEnv, 42, { include_contributors: true })).resolves.toMatchObject({
			query_id: 42,
			name: 'demo',
		})
		await expect(executeQuery(publicEnv, 42, { performance: 'medium' })).resolves.toMatchObject({
			execution_id: 'exec-1',
		})
		await expect(getExecutionResults(publicEnv, 'exec-1', { limit: 10, offset: 0 })).resolves.toMatchObject({
			execution_id: 'exec-1',
			result: { rows: [{ a: 1 }] },
		})
		await expect(getLatestQueryResults(publicEnv, 42, { limit: 5 })).resolves.toMatchObject({
			execution_id: 'exec-2',
		})
		await expect(getUsage(publicEnv, {})).resolves.toMatchObject({
			billingPeriods: [{ credits_used: 3, credits_included: 100 }],
		})

		const urls = fetchMock.mock.calls.map((call) => String(call[0]))
		expect(urls[0]).toMatch(/query%2F42%3Finclude_contributors%3Dtrue$/)
		expect(urls[1]).toMatch(/query%2F42%2Fexecute$/)
		expect(urls[2]).toMatch(/execution%2Fexec-1%2Fresults%3F/)
		expect(urls[2]).toContain('limit%3D10')
		expect(urls[3]).toMatch(/query%2F42%2Fresults%3F/)
		expect(urls[3]).toContain('limit%3D5')
		expect(urls[4]).toMatch(/usage$/)
		expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
			method: 'POST',
			body: JSON.stringify({ performance: 'medium' }),
		})
	})

	it('hard-fails HTTP errors on every query surface', async () => {
		vi.stubGlobal('window', {})
		vi.stubGlobal('fetch', vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 404))
			.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 500))
			.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 502))
			.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 503))
			.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 401))
		)

		await expect(getQuery(publicEnv, 1)).rejects.toThrow(/404/)
		await expect(executeQuery(publicEnv, 1)).rejects.toThrow(/500/)
		await expect(getExecutionResults(publicEnv, 'exec')).rejects.toThrow(/502/)
		await expect(getLatestQueryResults(publicEnv, 1)).rejects.toThrow(/503/)
		await expect(getUsage(publicEnv)).rejects.toThrow(/401/)
	})

	it('hard-fails execute payloads missing execution_id', async () => {
		vi.stubGlobal('window', {})
		vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			execution_id: '   ',
			state: 'QUERY_STATE_PENDING',
		})))

		await expect(executeQuery(publicEnv, 1)).rejects.toThrow('missing execution_id')
	})

	it('maps camelCase and snake_case usage credits and hard-fails empty envelopes', () => {
		expect(readUsageCredits({
			billingPeriods: [{ credits_used: 1 }],
		})).toEqual({ credits_used: 1 })
		expect(readUsageCredits({
			billing_periods: [{ credits_included: 50 }],
		})).toEqual({ credits_included: 50 })
		expect(() => readUsageCredits({})).toThrow('missing billing credits')
		expect(() => readUsageCredits({
			billingPeriods: [{}],
		})).toThrow('missing billing credits')
	})
})
