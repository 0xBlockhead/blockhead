// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EnsMetadataService/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EnsMetadataService,
	label: 'ENS metadata service',
	sources: [
		{
			source: Source.EnsMetadataService_Rest,
			label: 'ENS metadata service REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
