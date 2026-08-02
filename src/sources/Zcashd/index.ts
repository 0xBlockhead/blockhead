// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Zcashd/bindings.ts'

export default {
	provider: SourceProvider.Zcashd,
	label: 'zcashd',
	sources: {
		[Source.Zcashd_JsonRpc]: {
			label: 'zcashd JSON-RPC',
		},
		[Source.ZcashdWallet_JsonRpc]: {
			label: 'zcashd wallet JSON-RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
