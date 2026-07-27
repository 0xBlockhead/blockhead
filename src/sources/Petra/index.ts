// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Petra/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Petra,
	label: 'Petra',
	sources: [
		{
			source: Source.Petra_WalletApi,
			label: 'Petra wallet API',
		},
	],
	bindings: [bindings[Source.Petra_WalletApi]],
} satisfies SourceProviderDefinition
