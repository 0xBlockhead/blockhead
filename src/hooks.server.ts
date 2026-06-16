import { error, type Handle } from '@sveltejs/kit'
import { installPolyfills } from '@sveltejs/kit/node/polyfills'
import { sourceProviders } from '$/sources/index.ts'

installPolyfills()

const PROXY_PATH = '/api-proxy/'
const PROXY_UPSTREAM_TIMEOUT_MS = 30_000

const allowlistedProxyOrigins = new Set(
	sourceProviders.flatMap((provider) => (
		(provider.origins ?? []).map((entry) => entry.origin)
	))
)

export const handle: Handle = async ({
	event,
	resolve,
}) => {
	if (!event.url.pathname.startsWith(PROXY_PATH)) return resolve(event)

	const url = new URL(
		decodeURIComponent(event.url.pathname.replace(PROXY_PATH, '')) + event.url.search
	)

	if (!allowlistedProxyOrigins.has(url.origin)) throw error(403, 'Request Forbidden.')

	const headers = new Headers(event.request.headers)
	headers.delete('host')
	headers.set('Host', url.host)
	headers.delete('accept-encoding')

	try {
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
	} catch (err) {
		throw error(502, err instanceof Error ? err.message : 'Proxy upstream error')
	}
}
