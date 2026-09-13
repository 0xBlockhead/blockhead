import { error, type Handle } from '@sveltejs/kit'
import { installPolyfills } from '@sveltejs/kit/node/polyfills'

import { proxySourceHttpRequest } from '$/sources/_runtime/proxy.server.ts'

installPolyfills()

const PROXY_PATH = '/api-proxy/'

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith(PROXY_PATH)) {
		const response = await resolve(event)
		// Large native routes exceed the edge's response-header limit with preload hints.
		// Module imports still load normally; keep all security headers intact.
		response.headers.delete('link')
		return response
	}

	try {
		return await proxySourceHttpRequest(event)
	}
	catch (cause) {
		if (cause instanceof Response) throw cause
		throw error(502, cause instanceof Error ? cause.message : 'Proxy upstream error')
	}
}
