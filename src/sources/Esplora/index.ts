// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Esplora/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Esplora,
	label: 'Esplora',
	sources: [
		{
			source: Source.Esplora_Rest,
			label: 'Esplora REST',
		},
	],
	bindings: bindings[Source.Esplora_Rest],
} satisfies SourceProviderDefinition
