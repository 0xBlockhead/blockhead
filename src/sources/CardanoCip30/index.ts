// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CardanoCip30/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CardanoCip30,
	label: 'Cardano CIP-30',
	sources: [
		{
			source: Source.CardanoCip30_WalletApi,
			label: 'Cardano CIP-30 wallet API',
		},
	],
	bindings: [bindings[Source.CardanoCip30_WalletApi]],
} satisfies SourceProviderDefinition
