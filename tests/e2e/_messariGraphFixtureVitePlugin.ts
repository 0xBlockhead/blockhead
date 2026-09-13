import { messariGraphFixtureResponse } from './_messariGraphFixtureServer.ts'

export const messariGraphFixtureVitePlugin = () => ({
	name: 'blockhead-e2e-messari-graph-fixture',
	configureServer() {
		const originalFetch = globalThis.fetch
		globalThis.fetch = async (input, init) => {
			const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
			if (!url.startsWith('https://gateway.thegraph.com/api/subgraphs/id/'))
				return originalFetch(input, init)
			let request: Parameters<typeof messariGraphFixtureResponse>[0]
			try {
				request = JSON.parse(typeof init?.body === 'string' ? init.body : '')
			} catch {
				return originalFetch(input, init)
			}
			const body = messariGraphFixtureResponse(request)
		return body == null ? originalFetch(input, init) : new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		})
		}
	},
})
