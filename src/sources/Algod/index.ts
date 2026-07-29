// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Algod/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Algod,
	label: 'Algod',
	sources: [
		{
			source: Source.Algod_Rest,
			label: 'Algod REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
