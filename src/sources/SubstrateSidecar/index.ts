import { TransportType } from '$/constants/TransportType.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import SubstrateSidecarRest from '$/sources/SubstrateSidecar/Rest/index.ts'


// Constants

export const substrateSidecarRestEndpoints = [
	{
		url: 'http://127.0.0.1:8080',
		transportType: TransportType.Http,
		providerName: 'Local Substrate Sidecar',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Provider

export default {
	provider: SourceProvider.SubstrateSidecar,
	label: 'Substrate API Sidecar',
	origins: substrateSidecarRestEndpoints.map((endpoint) => ({
		origin: new URL(endpoint.url).origin,
		corsEnabled: false,
	})),
	sources: [
		SubstrateSidecarRest,
	],
} as const satisfies SourceProviderDefinition
