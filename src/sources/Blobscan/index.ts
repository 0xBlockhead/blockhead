// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Blobscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Blobscan,
	label: 'Blobscan',
	sources: [
		{
			source: Source.Blobscan_Rest,
			label: 'Blobscan REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
