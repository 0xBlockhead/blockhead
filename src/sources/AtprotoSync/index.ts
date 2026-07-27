// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AtprotoSync/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AtprotoSync,
	label: 'AT Protocol sync',
	sources: [
		{
			source: Source.AtprotoSync_Xrpc,
			label: 'AT Protocol sync XRPC',
		},
	],
	bindings: [bindings[Source.AtprotoSync_Xrpc]],
} satisfies SourceProviderDefinition
