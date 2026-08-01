// Generated from APP.ts.

import bindings from '$/sources/NearConnect/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.NearConnect,
	label: 'NEAR Connect',
	sources: [
		{
			source: Source.NearConnect_WalletApi,
			label: 'NEAR Connect wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
