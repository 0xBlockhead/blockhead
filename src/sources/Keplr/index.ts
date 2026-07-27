// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Keplr/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Keplr,
	label: 'Keplr',
	sources: [
		{
			source: Source.Keplr_WalletApi,
			label: 'Keplr wallet API',
		},
	],
	bindings: [bindings[Source.Keplr_WalletApi]],
} satisfies SourceProviderDefinition
