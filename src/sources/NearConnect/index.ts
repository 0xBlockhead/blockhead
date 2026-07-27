// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/NearConnect/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NearConnect,
	label: 'NEAR Connect',
	sources: [
		{
			source: Source.NearConnect_WalletApi,
			label: 'NEAR Connect wallet API',
		},
	],
	bindings: [bindings[Source.NearConnect_WalletApi]],
} satisfies SourceProviderDefinition
