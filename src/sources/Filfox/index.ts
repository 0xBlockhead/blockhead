import bindings from '$/sources/Filfox/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Filfox,
	label: 'Filfox',
	sources: {
		[Source.Filfox_Rest]: {
			label: 'Filfox REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
