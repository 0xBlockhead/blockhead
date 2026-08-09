import bindings from '$/sources/CosmosAdrs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CosmosAdrs,
	label: 'Cosmos ADRs',
	sources: {
		[Source.CosmosAdrs_Github]: {
			label: 'Cosmos ADRs GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
