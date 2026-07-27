// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Zcashd/bindings.ts'

export default {
	provider: SourceProvider.Zcashd,
	label: 'zcashd',
	sources: [
		{
			source: Source.Zcashd_JsonRpc,
			label: 'zcashd JSON-RPC',
		},
		{
			source: Source.ZcashdWallet_JsonRpc,
			label: 'zcashd wallet JSON-RPC',
		},
	],
	bindings: [
		bindings[Source.Zcashd_JsonRpc],
		bindings[Source.ZcashdWallet_JsonRpc],
	],
} satisfies SourceProviderDefinition
