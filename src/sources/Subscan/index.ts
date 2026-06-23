import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	subscanBindings,
	subscanPublicEnv,
} from '$/sources/Subscan/bindings.ts'

export const subscanPolkadotRestEndpoints = [
	{
		url: subscanBindings[0].endpoints[0].locator,
		transportType: TransportType.Http,
		providerName: 'Subscan',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export const subscanOrigins = [
	...new Map(
		subscanBindings
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
	provider: SourceProvider.Subscan,
	label: 'Subscan',
	env: subscanPublicEnv,
	sources: [
		{
			provider: SourceProvider.Subscan,
			source: Source.Subscan_Rest,
			label: 'Subscan REST',
			env: subscanPublicEnv,
		},
	],
	bindings: subscanBindings,
} satisfies SourceProviderDefinition
