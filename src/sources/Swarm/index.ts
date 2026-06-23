import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { swarmBindings } from '$/sources/Swarm/bindings.ts'

export default {
	provider: SourceProvider.Swarm,
	label: 'Swarm',
	sources: [
		{
			provider: SourceProvider.Swarm,
			source: Source.Swarm_Rest,
			label: 'Swarm Gateway',
		},
	],
	bindings: swarmBindings,
} satisfies SourceProviderDefinition
