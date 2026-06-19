// Constants
export const atprotoNetworkSeedActors = [
	{
		did: 'did:plc:z72i7hdynmk6r22z27h6tvur',
	},
] as const satisfies readonly {
	did: string
}[]

export const atprotoNetworkSeedPosts = [
	{
		uri: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l',
		authorDid: 'did:plc:z72i7hdynmk6r22z27h6tvur',
	},
] as const satisfies readonly {
	uri: string
	authorDid: string
}[]


// Lookups

export const atprotoNetworkSeedPostByUri = Object.fromEntries(
	atprotoNetworkSeedPosts.map((post) => [
		post.uri,
		post,
	])
)
