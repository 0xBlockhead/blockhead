// Generated from APP.ts.

import bindings from '$/sources/BitcoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BitcoinCore,
	label: 'Bitcoin Core',
	sources: [
		{
			source: Source.BitcoinCore_JsonRpc,
			label: 'Bitcoin Core JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
