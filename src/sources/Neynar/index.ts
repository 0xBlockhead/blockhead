import bindings from '$/sources/Neynar/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Neynar,
	label: 'Neynar',
	sources: {
		[Source.Neynar_Rest]: {
			label: 'Neynar REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
