/**
 * Blobscan REST API hosts (`api.*.blobscan.com`) and list pagination ceiling.
 * @see https://docs.blobscan.com/docs/api
 * @see https://api.blobscan.com (Swagger UI)
 */


// Types

type BlobscanRestHost = {
	chainId: number
	label: string
	restBaseUrl: `https://${string}`
}


// Constants

/** Inclusive maximum `ps` (page size) for `/blobs` and `/blocks` list queries. */
export const blobscanRestPageSizeMax = 100

export const blobscanRestHosts = [
	{
		chainId: 1,
		label: 'Ethereum',
		restBaseUrl: 'https://api.blobscan.com',
	},
	{
		chainId: 11155111,
		label: 'Sepolia',
		restBaseUrl: 'https://api.sepolia.blobscan.com',
	},
	{
		chainId: 100,
		label: 'Gnosis',
		restBaseUrl: 'https://api.gnosis.blobscan.com',
	},
	{
		chainId: 560048,
		label: 'Hoodi',
		restBaseUrl: 'https://api.hoodi.blobscan.com',
	},
] as const satisfies readonly BlobscanRestHost[]


// Lookups

export const blobscanRestHostByChainId = Object.fromEntries(
	blobscanRestHosts.map((host) => [
		host.chainId,
		host,
	])
)
