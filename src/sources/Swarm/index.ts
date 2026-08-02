// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
