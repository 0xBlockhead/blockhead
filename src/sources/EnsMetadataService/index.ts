import bindings from '$/sources/EnsMetadataService/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EnsMetadataService,
	label: 'ENS metadata service',
	sources: {
		[Source.EnsMetadataService]: {
			label: 'ENS metadata service',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
