import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	beaconchaInBindings,
	beaconchaInPublicEnv,
} from '$/sources/BeaconchaIn/bindings.ts'

export const beaconchaInOrigins = [
	...new Map(
		beaconchaInBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export default {
	provider: SourceProvider.BeaconchaIn,
	label: 'Beaconcha.in',
	env: beaconchaInPublicEnv,
	sources: [
		{
			provider: SourceProvider.BeaconchaIn,
			source: Source.BeaconchaIn_Rest,
			label: 'Beaconcha.in REST',
			env: beaconchaInPublicEnv,
		},
	],
	bindings: beaconchaInBindings,
} satisfies SourceProviderDefinition
