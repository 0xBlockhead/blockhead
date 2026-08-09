import bindings from '$/sources/Forgejo/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Forgejo,
	label: 'Forgejo',
	sources: {
		[Source.Forgejo_Rest]: {
			label: 'Forgejo REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
