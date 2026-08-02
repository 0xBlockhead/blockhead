// Generated from APP.ts.

import bindings from '$/sources/CardanoCip30/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CardanoCip30,
	label: 'Cardano CIP-30',
	sources: [
		{
			source: Source.CardanoCip30_WalletApi,
			label: 'Cardano CIP-30 wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
