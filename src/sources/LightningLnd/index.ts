import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	lightningLndBindings,
	lightningLndPublicEnv,
} from '$/sources/LightningLnd/bindings.ts'

export const lightningLndOrigins = [
	...new Map(
		lightningLndBindings
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
	provider: SourceProvider.LightningLnd,
	label: 'LND',
	env: lightningLndPublicEnv,
	sources: [
		{
			provider: SourceProvider.LightningLnd,
			source: Source.LightningLnd_Grpc,
			label: 'LND gRPC',
		},
		{
			provider: SourceProvider.LightningLnd,
			source: Source.LightningLnd_Rest,
			label: 'LND REST',
			env: lightningLndPublicEnv,
		},
	],
	bindings: lightningLndBindings,
} satisfies SourceProviderDefinition
