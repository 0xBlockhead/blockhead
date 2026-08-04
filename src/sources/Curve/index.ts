import bindings from '$/sources/Curve/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Curve,
	label: 'Curve',
	sources: {
		[Source.Curve_Rest]: {
			label: 'Curve Finance REST API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
