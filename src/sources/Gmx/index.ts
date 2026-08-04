import bindings from '$/sources/Gmx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Gmx,
	label: 'GMX',
	sources: {
		[Source.Gmx_Rest]: {
			label: 'GMX API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
