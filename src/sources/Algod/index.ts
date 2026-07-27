// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Algod/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Algod,
	label: 'Algod',
	sources: [
		{
			source: Source.Algod_Rest,
			label: 'Algod REST',
		},
	],
	bindings: [bindings[Source.Algod_Rest]],
} satisfies SourceProviderDefinition
