import bindings from '$/sources/Ensips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Ensips,
	label: 'ENSIPs',
	sources: {
		[Source.Ensips_Github]: {
			label: 'ENSIPs GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
