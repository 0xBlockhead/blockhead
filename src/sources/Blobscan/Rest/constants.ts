import { ChainId } from '$/constants/ChainId.ts'


export const blobscanRestApiOrigins = [
	{
		chainId: ChainId.Ethereum,
		origin: 'https://api.blobscan.com',
		corsEnabled: false,
	},
	{
		chainId: ChainId.EthereumSepolia,
		origin: 'https://api.sepolia.blobscan.com',
		corsEnabled: false,
	},
	{
		chainId: ChainId.Gnosis,
		origin: 'https://api.gnosis.blobscan.com',
		corsEnabled: false,
	},
	/** Ethereum Hoodi testnet (Blobscan deployment). */
	{
		chainId: 560048,
		origin: 'https://api.hoodi.blobscan.com',
		corsEnabled: false,
	},
] as const

export const blobscanOrigins = blobscanRestApiOrigins.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))


export const blobscanRestApiOriginByChainId: Partial<Record<number, string>> = Object.fromEntries(
	blobscanRestApiOrigins.map((endpoint) => [
		endpoint.chainId,
		endpoint.origin,
	])
)
