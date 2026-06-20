import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import EsploraRest from '$/sources/Esplora/Rest/index.ts'
import {
	bitcoinNetworkBySlug,
} from '$/constants/BitcoinNetwork.ts'

export const liquidMainnetEsploraRestEndpoints = [
	{
		restBaseUrl: 'https://blockstream.info/liquid/api',
	},
] as const satisfies readonly {
	restBaseUrl: string
}[]

export const esploraRestBaseUrlByNetworkKey = {
	[`${bitcoinNetworkBySlug.bitcoin.caip2.namespace}:${bitcoinNetworkBySlug.bitcoin.caip2.reference}`]: bitcoinNetworkBySlug.bitcoin.esploraRestBaseUrl,
	liquid: liquidMainnetEsploraRestEndpoints[0].restBaseUrl,
} as const satisfies Partial<Record<string, string>>

export default {
	provider: SourceProvider.Esplora,
	label: 'Esplora',
	origins: liquidMainnetEsploraRestEndpoints.map((endpoint) => ({
		origin: new URL(endpoint.restBaseUrl).origin,
		corsEnabled: true,
	})),
	sources: [
		EsploraRest,
	],
} as const satisfies SourceProviderDefinition
