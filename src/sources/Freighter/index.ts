// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Freighter/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Freighter,
	label: 'Freighter',
	sources: [
		{
			source: Source.Freighter_WalletApi,
			label: 'Freighter wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
