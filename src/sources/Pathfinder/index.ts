import bindings from '$/sources/Pathfinder/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Pathfinder,
	label: 'Pathfinder',
	sources: {
		[Source.Pathfinder]: {
			label: 'Pathfinder',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
