// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MetadataVision/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MetadataVision,
	label: 'Metadata Vision',
	sources: [
		{
			source: Source.MetadataVision_Rest,
			label: 'Metadata Vision Open Graph',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
