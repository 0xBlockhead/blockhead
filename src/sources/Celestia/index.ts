import bindings from '$/sources/Celestia/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Celestia,
	label: 'Celestia',
	sources: {
		[Source.CelestiaNode]: {
			label: 'Celestia Node',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
