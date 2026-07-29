// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MetaplexDAS/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MetaplexDAS,
	label: 'Metaplex DAS',
	sources: [
		{
			source: Source.MetaplexDAS_Rest,
			label: 'Metaplex DAS REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
