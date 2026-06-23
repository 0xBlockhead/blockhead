import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { beaconBindings } from '$/sources/Beacon/bindings.ts'

export const beaconOrigins = [
	...new Map(
		beaconBindings
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
	provider: SourceProvider.Beacon,
	label: 'Beacon',
	sources: [
		{
			provider: SourceProvider.Beacon,
			source: Source.Beacon_Rest,
			label: 'Beacon (consensus) REST',
		},
	],
	bindings: beaconBindings,
} satisfies SourceProviderDefinition
