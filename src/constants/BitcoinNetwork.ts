import { networkBySlug } from '$/constants/Network.ts'


// Constants

export const bitcoinNetworks = [
	{
		slug: 'bitcoin',
		caip2: networkBySlug.bitcoin.caip2,
		bitcoinCoreRpcUrl: 'http://127.0.0.1:8332',
		esploraRestBaseUrl: 'https://blockstream.info/api',
		mempoolSpaceRestBaseUrl: 'https://mempool.space/api',
	},
	{
		slug: 'litecoin',
		caip2: networkBySlug.litecoin.caip2,
		litecoinCoreRpcUrl: 'http://127.0.0.1:9332',
	},
	{
		slug: 'dogecoin',
		caip2: networkBySlug.dogecoin.caip2,
		dogecoinCoreRpcUrl: 'http://127.0.0.1:22555',
	},
	{
		slug: 'zcash',
		caip2: networkBySlug.zcash.caip2,
		zcashdRpcUrl: 'http://127.0.0.1:8232',
		zebraRpcUrl: 'http://127.0.0.1:8232',
	},
	{
		slug: 'bitcoin-cash',
		caip2: networkBySlug['bitcoin-cash'].caip2,
		bitcoinCashNodeRpcUrl: 'http://127.0.0.1:8332',
	},
] as const satisfies readonly {
	slug: keyof Pick<typeof networkBySlug, 'bitcoin' | 'litecoin' | 'dogecoin' | 'zcash' | 'bitcoin-cash'>
	caip2: {
		namespace: string
		reference: string
	}
	bitcoinCoreRpcUrl?: string
	litecoinCoreRpcUrl?: string
	dogecoinCoreRpcUrl?: string
	zcashdRpcUrl?: string
	zebraRpcUrl?: string
	bitcoinCashNodeRpcUrl?: string
	esploraRestBaseUrl?: string
	mempoolSpaceRestBaseUrl?: string
}[]


// Lookups

export const bitcoinNetworkBySlug = {
	bitcoin: bitcoinNetworks[0],
	litecoin: bitcoinNetworks[1],
	dogecoin: bitcoinNetworks[2],
	zcash: bitcoinNetworks[3],
	'bitcoin-cash': bitcoinNetworks[4],
}
