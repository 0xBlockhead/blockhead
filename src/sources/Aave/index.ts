import bindings from '$/sources/Aave/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Aave,
	label: 'Aave',
	sources: {
		[Source.Aave_Rest]: {
			label: 'Aave V3 GraphQL API',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
