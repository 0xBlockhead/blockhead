// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Allium/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Allium,
	label: 'Allium',
	sources: [
		{
			source: Source.Allium_Rest,
			label: 'Allium REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
