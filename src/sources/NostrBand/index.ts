// Generated from APP.ts.

import bindings from '$/sources/NostrBand/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.NostrBand,
	label: 'NostrBand',
	sources: [
		{
			source: Source.NostrBand_Rest,
			label: 'NostrBand REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
