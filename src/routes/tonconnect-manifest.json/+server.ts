import type { RequestEvent, RequestHandler } from './$types'

type ManifestRequestEvent = Pick<RequestEvent, 'url'>

const getManifest = ({ url }: ManifestRequestEvent) => (
	new Response(JSON.stringify({
		url: url.origin,
		name: 'Blockhead',
		iconUrl: new URL('/favicon.png', url.origin).toString(),
	}), {
		headers: {
			'access-control-allow-origin': '*',
			'content-type': 'application/json',
		},
	})
)

export const GET = getManifest satisfies RequestHandler
