// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EnsMetadataService/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EnsMetadataService,
	label: 'ENS metadata service',
	sources: [
		{
			source: Source.EnsMetadataService_Rest,
			label: 'ENS metadata service REST',
		},
	],
	bindings: [bindings[Source.EnsMetadataService_Rest]],
} satisfies SourceProviderDefinition
