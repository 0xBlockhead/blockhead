import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/UniSat/bindings.ts'

export default {
	provider: SourceProvider.UniSat,
	label: 'UniSat',
	sources: {
		[Source.UniSat_Rest]: {
			label: 'UniSat OpenAPI',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
