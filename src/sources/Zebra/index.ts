// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Zebra/bindings.ts'

export default {
	provider: SourceProvider.Zebra,
	label: 'Zebra',
	sources: [
		{
			source: Source.Zebra_JsonRpc,
			label: 'Zebra JSON-RPC',
		},
	],
	bindings: [bindings[Source.Zebra_JsonRpc]],
} satisfies SourceProviderDefinition
