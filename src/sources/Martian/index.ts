// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Martian/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Martian,
	label: 'Martian',
	sources: [
		{
			source: Source.Martian_WalletApi,
			label: 'Martian wallet API',
		},
	],
	bindings: [bindings[Source.Martian_WalletApi]],
} satisfies SourceProviderDefinition
