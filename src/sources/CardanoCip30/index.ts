import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cardanoCip30Bindings } from '$/sources/CardanoCip30/bindings.ts'

export default {
	provider: SourceProvider.CardanoCip30,
	label: 'Cardano CIP-30',
	sources: [
		{
			provider: SourceProvider.CardanoCip30,
			source: Source.CardanoCip30_WalletApi,
			label: 'Cardano CIP-30 wallet API',
		},
	],
	bindings: cardanoCip30Bindings,
} satisfies SourceProviderDefinition
