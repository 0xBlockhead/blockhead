import { bitcoinNetworkBySlug } from '$/constants/BitcoinNetwork.ts'

export const liquidMainnetEsploraRestEndpoints = [
	{
		restBaseUrl: 'https://blockstream.info/liquid/api',
	},
] as const satisfies readonly {
	restBaseUrl: string
}[]

export const esploraRestBaseUrlByNetworkKey = {
	[`${bitcoinNetworkBySlug.bitcoin.caip2.namespace}:${bitcoinNetworkBySlug.bitcoin.caip2.reference}`]: bitcoinNetworkBySlug.bitcoin.esploraRestBaseUrl,
	bitcoin: bitcoinNetworkBySlug.bitcoin.esploraRestBaseUrl,
	liquid: liquidMainnetEsploraRestEndpoints[0].restBaseUrl,
} as const satisfies Partial<Record<string, string>>

export const esploraOrigins = [
	...new Map(
		Object.values(esploraRestBaseUrlByNetworkKey)
			.map((restBaseUrl) => [
				new URL(restBaseUrl).origin,
				{
					origin: new URL(restBaseUrl).origin,
					corsEnabled: true,
				},
			])
	).values(),
]
