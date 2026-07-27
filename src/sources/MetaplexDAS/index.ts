// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MetaplexDAS/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MetaplexDAS,
	label: 'Metaplex DAS',
	sources: [
		{
			source: Source.MetaplexDAS_Rest,
			label: 'Metaplex DAS REST',
		},
	],
	bindings: [bindings[Source.MetaplexDAS_Rest]],
} satisfies SourceProviderDefinition
