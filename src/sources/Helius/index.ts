// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Helius/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Helius,
	label: 'Helius',
	sources: [
		{
			source: Source.Helius,
			label: 'Helius',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
