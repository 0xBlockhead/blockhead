// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Mintscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Mintscan,
	label: 'Mintscan',
	sources: [
		{
			source: Source.Mintscan,
			label: 'Mintscan',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
