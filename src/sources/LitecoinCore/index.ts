// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LitecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LitecoinCore,
	label: 'Litecoin Core',
	sources: [
		{
			source: Source.LitecoinCore_JsonRpc,
			label: 'Litecoin Core JSON-RPC',
		},
	],
	bindings: [bindings[Source.LitecoinCore_JsonRpc]],
} satisfies SourceProviderDefinition
