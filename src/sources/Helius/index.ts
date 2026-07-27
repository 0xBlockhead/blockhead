// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Helius/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Helius,
	label: 'Helius',
	sources: [
		{
			source: Source.Helius_Rest,
			label: 'Helius REST',
		},
	],
	bindings: [bindings[Source.Helius_Rest]],
} satisfies SourceProviderDefinition
