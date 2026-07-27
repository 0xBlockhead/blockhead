// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Nfid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Nfid,
	label: 'NFID',
	sources: [
		{
			source: Source.Nfid_WalletApi,
			label: 'NFID wallet API',
		},
	],
	bindings: [bindings[Source.Nfid_WalletApi]],
} satisfies SourceProviderDefinition
