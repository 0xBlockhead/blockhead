// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Celenium/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Celenium,
	label: 'Celenium',
	sources: [
		{
			source: Source.Celenium_Rest,
			label: 'Celenium REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
