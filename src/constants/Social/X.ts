// Constants
/** User `id` is X’s string user id (REST `id` / `id_str`), not @handle. */
export const xNetworkSeedUsers = [
	{ id: '783214' },
] as const satisfies readonly {
	id: string
}[]

export const xNetworkSeedPosts = [
	{ id: '1855943488122347520' },
] as const satisfies readonly {
	id: string
}[]


// Lookups

export const xNetworkSeedPostById = Object.fromEntries(
	xNetworkSeedPosts.map((post) => [
		post.id,
		post,
	])
)
