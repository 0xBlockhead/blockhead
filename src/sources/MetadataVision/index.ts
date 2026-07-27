// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MetadataVision/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MetadataVision,
	label: 'Metadata Vision',
	sources: [
		{
			source: Source.MetadataVision_Rest,
			label: 'Metadata Vision Open Graph',
		},
	],
	bindings: [bindings[Source.MetadataVision_Rest]],
} satisfies SourceProviderDefinition
