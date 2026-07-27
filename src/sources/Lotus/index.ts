// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Lotus/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Lotus,
	label: 'Lotus',
	sources: [
		{
			source: Source.Lotus_JsonRpc,
			label: 'Lotus JSON-RPC',
		},
	],
	bindings: bindings[Source.Lotus_JsonRpc],
} satisfies SourceProviderDefinition
