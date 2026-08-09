import bindings from '$/sources/L2Beat/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.L2Beat,
	label: 'L2Beat',
	sources: {
		[Source.L2Beat_Rest]: {
			label: 'L2Beat REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
