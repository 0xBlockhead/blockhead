// Generated from APP.ts.

import bindings from '$/sources/MetadataVision/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MetadataVision,
	label: 'Metadata Vision',
	sources: {
		[Source.MetadataVision_Rest]: {
			label: 'Metadata Vision Open Graph',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
