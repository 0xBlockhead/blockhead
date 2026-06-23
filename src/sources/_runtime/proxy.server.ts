import { error, type RequestEvent } from '@sveltejs/kit'

import { httpProxyOrigins } from '$/sources/index.server.ts'

const PROXY_UPSTREAM_TIMEOUT_MS = 30_000

export const proxySourceHttpRequest = async (
	event: RequestEvent
): Promise<Response> => {
	const url = new URL(
		decodeURIComponent(event.url.pathname.replace('/api-proxy/', '')) + event.url.search
	)

	if (!httpProxyOrigins.has(url.origin))
		throw error(403, 'Request Forbidden.')

	const headers = new Headers(event.request.headers)
	headers.delete('host')
	headers.set('Host', url.host)
	headers.delete('accept-encoding')

	const upstream = await event.fetch(url, {
		method: event.request.method,
		headers,
		body: event.request.body,
		signal: AbortSignal.timeout(PROXY_UPSTREAM_TIMEOUT_MS),
		...(event.request.body != null && {
			duplex: 'half',
		}),
	})

	const responseHeaders = new Headers(upstream.headers)
	responseHeaders.delete('content-encoding')
	responseHeaders.delete('content-length')
	responseHeaders.delete('transfer-encoding')

	return new Response(upstream.body, {
		status: upstream.status === 403 ? 502 : upstream.status,
		statusText: upstream.statusText,
		headers: responseHeaders,
	})
}
