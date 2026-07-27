// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Freighter/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Freighter,
	label: 'Freighter',
	sources: [
		{
			source: Source.Freighter_WalletApi,
			label: 'Freighter wallet API',
		},
	],
	bindings: [bindings[Source.Freighter_WalletApi]],
} satisfies SourceProviderDefinition
