import { TransportType } from '$/constants/TransportType.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import NearBlocksRest from '$/sources/NearBlocks/Rest/index.ts'


// Constants

export const nearBlocksMainnetRestEndpoints = [
	{
		url: 'https://api.nearblocks.io',
		transportType: TransportType.Http,
		providerName: 'NearBlocks',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Provider

export default {
	provider: SourceProvider.NearBlocks,
	label: 'NearBlocks',
	origins: [
		...nearBlocksMainnetRestEndpoints.map((endpoint) => ({
			origin: new URL(endpoint.url).origin,
			corsEnabled: true,
		})),
	],
	sources: [
		NearBlocksRest,
	],
} as const satisfies SourceProviderDefinition
