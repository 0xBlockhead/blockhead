import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	substrateSidecarBindings,
	substrateSidecarPublicEnv,
} from '$/sources/SubstrateSidecar/bindings.ts'

export const substrateSidecarRestEndpoints = [
	{
		url: substrateSidecarBindings[0].endpoints[0].locator,
		transportType: TransportType.Http,
		providerName: 'Local Substrate Sidecar',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export const substrateSidecarOrigins = [
	...new Map(
		substrateSidecarBindings
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => [
				endpoint.origin,
				{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled,
				},
			])
	).values(),
]

export default {
	provider: SourceProvider.SubstrateSidecar,
	label: 'Substrate API Sidecar',
	env: substrateSidecarPublicEnv,
	sources: [
		{
			provider: SourceProvider.SubstrateSidecar,
			source: Source.SubstrateSidecar_Rest,
			label: 'Substrate API Sidecar REST',
			env: substrateSidecarPublicEnv,
		},
	],
	bindings: substrateSidecarBindings,
} satisfies SourceProviderDefinition
