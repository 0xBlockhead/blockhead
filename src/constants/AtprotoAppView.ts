/**
	* AT Protocol public read client (Bluesky appview). Wire: HTTPS + XRPC.
	* @see https://docs.bsky.app/docs/api/content-reference
	*/


// Constants

export const atprotoAppViews = [
	{
		slug: 'bsky_public',
		origin: 'https://public.api.bsky.app',
		xrpcPath: '/xrpc',
	},
] as const satisfies readonly {
	slug: 'bsky_public'
	origin: `https://${string}`
	xrpcPath: `/${string}`
}[]


// Lookups

export const atprotoAppViewBySlug = {
	bsky_public: atprotoAppViews[0],
}
