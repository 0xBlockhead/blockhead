import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'


// Constants

export const quilibriumDocsEndpoints = [
	{
		url: 'https://docs.quilibrium.com',
		transportType: TransportType.Http,
		providerName: 'Quilibrium docs',
	},
	{
		url: 'https://quilibrium.com',
		transportType: TransportType.Http,
		providerName: 'Quilibrium',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Source provider

export default {
	provider: SourceProvider.QuilibriumDocs,
	label: 'Quilibrium docs',
	origins: quilibriumDocsEndpoints.map((endpoint) => ({
		origin: new URL(endpoint.url).origin,
		corsEnabled: true,
	})),
	sources: [
		{
			provider: SourceProvider.QuilibriumDocs,
			source: Source.QuilibriumDocs_Rest,
			label: 'Quilibrium docs',
		},
	],
} as const satisfies SourceProviderDefinition
