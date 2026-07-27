// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Pontem/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Pontem,
	label: 'Pontem',
	sources: [
		{
			source: Source.Pontem_WalletApi,
			label: 'Pontem wallet API',
		},
	],
	bindings: [bindings[Source.Pontem_WalletApi]],
} satisfies SourceProviderDefinition
