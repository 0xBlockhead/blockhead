// Generated from APP.ts.

import bindings from '$/sources/AtprotoSync/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AtprotoSync,
	label: 'AT Protocol sync',
	sources: [
		{
			source: Source.AtprotoSync_Xrpc,
			label: 'AT Protocol sync XRPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
