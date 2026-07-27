import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const privateEnv = vi.hoisted(() => ({
	HEADER_SECRET: 'header-secret',
	QUERY_SECRET: 'query secret',
	TEMPLATE_SECRET: 'template/secret',
}))

vi.mock('$env/dynamic/private', () => ({
	env: privateEnv,
}))

vi.mock('$/sources/$sourceServerCredentials.server.ts', () => ({
	default: {
		header: {
			envKey: 'HEADER_SECRET',
			injection: {
				header: {
					name: 'Authorization',
					prefix: 'Bearer ',
				},
			},
		},
		query: {
			envKey: 'QUERY_SECRET',
			injection: {
				query: {
					name: 'api_key',
				},
			},
		},
		template: {
			envKey: 'TEMPLATE_SECRET',
			injection: {
				endpointTemplate: {
					slot: 'token',
				},
			},
		},
	},
}))

vi.mock('$/sources/index.server.ts', () => ({
	httpProxyBindingByProxyId: new Map([
		['header', {
			serverCredentialId: 'header',
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://api.example.test/v1',
				origin: 'https://api.example.test',
			}],
		}],
		['query', {
			serverCredentialId: 'query',
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://api.example.test/v1',
				origin: 'https://api.example.test',
			}],
		}],
		['template', {
			serverCredentialId: 'template',
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://api.example.test/tenant/{token}/v1',
				origin: 'https://api.example.test',
			}],
		}],
		['fallback', {
			endpoints: [
				{
					endpointKind: 'HttpUrl',
					locator: 'https://primary.example.test/v1',
					origin: 'https://primary.example.test',
				},
				{
					endpointKind: 'HttpUrl',
					locator: 'https://fallback.example.test/api',
					origin: 'https://fallback.example.test',
				},
			],
		}],
	]),
	httpProxyOrigins: new Set([
		'https://api.example.test',
		'https://primary.example.test',
		'https://fallback.example.test',
	]),
}))

import { proxySourceHttpRequest } from '$/sources/_runtime/proxy.server.ts'

const proxyEvent = (
	proxyId: string,
	endpointIndex: number,
	upstreamUrl: string,
	upstream: Response = new Response('ok'),
	headers?: HeadersInit
) => {
	const url = new URL(
		`http://localhost/api-proxy/${encodeURIComponent(proxyId)}/${endpointIndex}/${encodeURIComponent(upstreamUrl)}`
	)
	return {
		event: {
			url,
			request: new Request(url, {
				headers,
			}),
			fetch: vi.fn().mockResolvedValue(upstream),
		},
	}
}

describe('runtime secret proxy', () => {
	it('replaces spoofed protected headers and applies the configured prefix', async () => {
		const { event } = proxyEvent(
			'header',
			0,
			'https://api.example.test/v1/blocks',
			new Response('ok'),
			{
				Authorization: 'Bearer client-secret',
				Cookie: 'session=client-secret',
				'X-Api-Key': 'client-secret',
			}
		)

		await proxySourceHttpRequest(event)

		const headers = event.fetch.mock.calls[0]?.[1]?.headers as Headers
		expect(headers.get('Authorization')).toBe('Bearer header-secret')
		expect(headers.has('Cookie')).toBe(false)
		expect(headers.has('X-Api-Key')).toBe(false)
	})

	it('deduplicates query credentials before injection', async () => {
		const { event } = proxyEvent(
			'query',
			0,
			'https://api.example.test/v1/blocks?api_key=first&api_key=second&limit=1'
		)

		await proxySourceHttpRequest(event)

		const url = event.fetch.mock.calls[0]?.[0] as URL
		expect(url.searchParams.getAll('api_key')).toEqual(['query secret'])
		expect(url.searchParams.get('limit')).toBe('1')
	})

	it('encodes endpoint-template credentials exactly once', async () => {
		const { event } = proxyEvent(
			'template',
			0,
			'https://api.example.test/tenant/{token}/v1/blocks'
		)

		await proxySourceHttpRequest(event)

		expect(String(event.fetch.mock.calls[0]?.[0]))
			.toBe('https://api.example.test/tenant/template%2Fsecret/v1/blocks')
	})

	it('fails over transient failures within one credential-free binding', async () => {
		const { event } = proxyEvent(
			'fallback',
			0,
			'https://primary.example.test/v1/blocks?height=latest'
		)
		event.request = new Request(event.url, {
			method: 'POST',
			body: '{"jsonrpc":"2.0"}',
		})
		event.fetch
			.mockResolvedValueOnce(new Response('upstream unavailable', { status: 502 }))
			.mockResolvedValueOnce(new Response('{"result":"0x1"}', {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			}))

		const response = await proxySourceHttpRequest(event)

		expect(response.status).toBe(200)
		expect(await response.text()).toBe('{"result":"0x1"}')
		expect(event.fetch).toHaveBeenCalledTimes(2)
		expect(String(event.fetch.mock.calls[1]?.[0]))
			.toBe('https://fallback.example.test/api/blocks?height=latest')
		for (const call of event.fetch.mock.calls) {
			const request = new Request(call[0], call[1])
			expect(request.method).toBe('POST')
			expect(await request.text()).toBe('{"jsonrpc":"2.0"}')
			expect(request.headers.has('Host')).toBe(false)
		}
		expect(event.fetch.mock.calls[0]?.[1]?.signal)
			.toBeInstanceOf(AbortSignal)
	})

	it.each([
		['unknown proxy identity', 'missing', 0, 'https://api.example.test/v1'],
		['wrong endpoint index', 'header', 1, 'https://api.example.test/v1'],
		['wrong origin', 'header', 0, 'https://other.example.test/v1'],
		['wrong locator', 'header', 0, 'https://api.example.test/v2'],
	])('fails closed for %s', async (_label, proxyId, endpointIndex, upstreamUrl) => {
		const { event } = proxyEvent(proxyId, endpointIndex, upstreamUrl)

		await expect(proxySourceHttpRequest(event)).rejects.toMatchObject({ status: 403 })
		expect(event.fetch).not.toHaveBeenCalled()
	})

	it('fails closed when the runtime secret is blank', async () => {
		privateEnv.HEADER_SECRET = ' '
		const { event } = proxyEvent('header', 0, 'https://api.example.test/v1')

		await expect(proxySourceHttpRequest(event)).rejects.toMatchObject({ status: 502 })
		expect(event.fetch).not.toHaveBeenCalled()
		privateEnv.HEADER_SECRET = 'header-secret'
	})

	it('keeps injected secret material out of local responses and request URLs', async () => {
		const { event } = proxyEvent(
			'header',
			0,
			'https://api.example.test/v1',
			new Response('upstream echoed header-secret', {
				headers: {
					'Content-Type': 'text/plain',
					'X-Upstream-Diagnostic': 'header-secret',
				},
			})
		)

		const response = await proxySourceHttpRequest(event)

		expect(await response.text()).toBe('upstream echoed [redacted]')
		expect(response.headers.has('X-Upstream-Diagnostic')).toBe(false)
		expect(event.url.href).not.toContain('header-secret')
	})

	it.each([301, 302, 307, 308])('rejects upstream %s redirects without forwarding Location', async (status) => {
		const { event } = proxyEvent(
			'header',
			0,
			'https://api.example.test/v1',
			new Response(null, {
				status,
				headers: {
					Location: 'https://redirect.example/header-secret',
				},
			})
		)

		const response = await proxySourceHttpRequest(event)

		expect(response.status).toBe(502)
		expect(response.headers.has('Location')).toBe(false)
		expect(await response.text()).not.toContain('header-secret')
		expect(event.url.href).not.toContain('header-secret')
		expect(event.fetch.mock.calls[0]?.[1]).toMatchObject({ redirect: 'manual' })
	})
})
