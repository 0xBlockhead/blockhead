import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import TronScanRest from '$/sources/TronScan/Rest/index.ts'

export const tronScanRestEndpoints = [
	{
		slug: 'tronscan',
		restBaseUrl: 'https://apilist.tronscanapi.com',
	},
] as const satisfies readonly {
	slug: 'tronscan'
	restBaseUrl: string
}[]

export default {
	provider: SourceProvider.TronScan,
	label: 'TRONSCAN',
	origins: tronScanRestEndpoints.map((endpoint) => ({
		origin: endpoint.restBaseUrl,
		corsEnabled: true,
	})),
	sources: [
		TronScanRest,
	],
} as const satisfies SourceProviderDefinition
