// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TronGrid/bindings.ts'

export default {
	provider: SourceProvider.TronGrid,
	label: 'TronGrid',
	sources: [
		{
			source: Source.TronGrid_Rest,
			label: 'TronGrid REST',
		},
	],
	bindings: [bindings[Source.TronGrid_Rest]],
} satisfies SourceProviderDefinition
