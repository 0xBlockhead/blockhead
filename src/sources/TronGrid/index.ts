import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import TronGridRest from '$/sources/TronGrid/Rest/index.ts'

export const tronGridRestEndpoints = [
	{
		slug: 'trongrid',
		restBaseUrl: 'https://api.trongrid.io',
	},
] as const satisfies readonly {
	slug: 'trongrid'
	restBaseUrl: string
}[]

export default {
	provider: SourceProvider.TronGrid,
	label: 'TronGrid',
	origins: tronGridRestEndpoints.map((endpoint) => ({
		origin: endpoint.restBaseUrl,
		corsEnabled: false,
	})),
	sources: [
		TronGridRest,
	],
} as const satisfies SourceProviderDefinition
