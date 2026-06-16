import { type as arktype } from 'arktype'

import { TransportType } from '$/constants/TransportType.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import SubscanRest from '$/sources/Subscan/Rest/index.ts'


// Constants

export const subscanPolkadotRestEndpoints = [
	{
		url: 'https://polkadot.api.subscan.io',
		transportType: TransportType.Http,
		providerName: 'Subscan',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Provider

export default {
	provider: SourceProvider.Subscan,
	label: 'Subscan',
	env: arktype({
		PUBLIC_SUBSCAN_API_KEY: 'string',
	}),
	origins: subscanPolkadotRestEndpoints.map((endpoint) => ({
		origin: new URL(endpoint.url).origin,
		corsEnabled: false,
	})),
	sources: [
		SubscanRest,
	],
} as const satisfies SourceProviderDefinition
