import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import EsploraRest from '$/sources/Esplora/Rest/index.ts'

export const liquidMainnetEsploraRestEndpoints = [
	{
		restBaseUrl: 'https://blockstream.info/liquid/api',
	},
] as const satisfies readonly {
	restBaseUrl: string
}[]

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
