import bindings from '$/sources/Amboss/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Amboss,
	label: 'Amboss',
	sources: {
		[Source.Amboss_Graphql]: {
			label: 'Amboss Space GraphQL',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
