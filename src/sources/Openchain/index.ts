// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Openchain/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Openchain,
	label: 'Openchain',
	sources: [
		{
			source: Source.Openchain_Rest,
			label: 'Openchain REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
