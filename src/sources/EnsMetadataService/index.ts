// Generated from APP.ts.

import bindings from '$/sources/EnsMetadataService/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EnsMetadataService,
	label: 'ENS metadata service',
	sources: [
		{
			source: Source.EnsMetadataService,
			label: 'ENS metadata service',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
