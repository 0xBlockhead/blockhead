// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Blobscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Blobscan,
	label: 'Blobscan',
	sources: [
		{
			source: Source.Blobscan_Rest,
			label: 'Blobscan REST',
		},
	],
	bindings: bindings[Source.Blobscan_Rest],
} satisfies SourceProviderDefinition
