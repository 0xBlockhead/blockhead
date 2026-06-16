import { ChainId } from '$/constants/ChainId.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'


/** Origins that host Blobscan REST (`api.*.blobscan.com`). Listed for `/api-proxy` and `httpFetch` routing. */
export const blobscanRestOrigins = [
	{
		origin: 'https://api.blobscan.com',
		corsEnabled: false,
	},
	{
		origin: 'https://api.sepolia.blobscan.com',
		corsEnabled: false,
	},
	{
		origin: 'https://api.gnosis.blobscan.com',
		corsEnabled: false,
	},
	/** Ethereum Hoodi testnet (Blobscan deployment). */
	{
		origin: 'https://api.hoodi.blobscan.com',
		corsEnabled: false,
	},
] as const satisfies readonly SourceOrigin[]


export const blobscanRestApiOriginForChainId = (
	chainId: number
): string | undefined => (
	chainId === ChainId.Ethereum ?
		'https://api.blobscan.com'
	: chainId === ChainId.EthereumSepolia ?
		'https://api.sepolia.blobscan.com'
	: chainId === ChainId.Gnosis ?
		'https://api.gnosis.blobscan.com'
	: chainId === 560048 ?
		'https://api.hoodi.blobscan.com'
	:
		undefined
)
