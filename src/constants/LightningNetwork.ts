// Constants
export const lightningNetworks = [
	{
		slug: 'lightning',
		mempoolSpaceRestBaseUrl: 'https://mempool.space/api/v1/lightning',
	},
] as const satisfies readonly {
	slug: 'lightning'
	mempoolSpaceRestBaseUrl: string
}[]


// Lookups

export const lightningNetworkBySlug = {
	lightning: lightningNetworks[0],
}
