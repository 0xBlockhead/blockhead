import { networkBySlug } from '$/constants/Network.ts'


// Constants

export const lightningNetworkId = {
	networkSlug: networkBySlug.lightning.slug,
} as const

export const lightningMempoolSpaceRestBaseUrl = 'https://mempool.space/api/v1/lightning'
