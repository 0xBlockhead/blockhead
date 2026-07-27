// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Swarm/bindings.ts'

export default {
	provider: SourceProvider.Swarm,
	label: 'Swarm',
	sources: [
		{
			source: Source.Swarm_Rest,
			label: 'Swarm Gateway',
		},
	],
	bindings: [bindings[Source.Swarm_Rest]],
} satisfies SourceProviderDefinition
