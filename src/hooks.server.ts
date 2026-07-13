import { error, type Handle } from '@sveltejs/kit'
import { installPolyfills } from '@sveltejs/kit/node/polyfills'

import { proxySourceHttpRequest } from '$/sources/_runtime/proxy.server.ts'

installPolyfills()

const PROXY_PATH = '/api-proxy/'

export const handle: Handle = async ({
	event,
	resolve,
}) => {
	if (!event.url.pathname.startsWith(PROXY_PATH)) return resolve(event)

	try {
		return await proxySourceHttpRequest(event)
	} catch (err) {
		if (err instanceof Response) throw err
		throw error(502, err instanceof Error ? err.message : 'Proxy upstream error')
	}
}
