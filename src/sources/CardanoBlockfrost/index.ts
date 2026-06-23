import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cardanoBlockfrostBindings } from '$/sources/CardanoBlockfrost/bindings.ts'

export default {
	provider: SourceProvider.CardanoBlockfrost,
	label: 'Cardano Blockfrost',
	sources: [
		{
			provider: SourceProvider.CardanoBlockfrost,
			source: Source.CardanoBlockfrost_Rest,
			label: 'Cardano Blockfrost REST',
		},
	],
	bindings: cardanoBlockfrostBindings,
} satisfies SourceProviderDefinition
