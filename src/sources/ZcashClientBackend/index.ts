// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/ZcashClientBackend/bindings.ts'

export default {
	provider: SourceProvider.ZcashClientBackend,
	label: 'zcash_client_backend',
	sources: [
		{
			source: Source.ZcashClientBackend_Local,
			label: 'zcash_client_backend local store',
		},
	],
	bindings: [bindings[Source.ZcashClientBackend_Local]],
} satisfies SourceProviderDefinition
