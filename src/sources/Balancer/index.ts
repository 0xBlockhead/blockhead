import bindings from '$/sources/Balancer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Balancer,
	label: 'Balancer',
	sources: {
		[Source.Balancer_Rest]: {
			label: 'Balancer API (v2/v3 GraphQL)',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
