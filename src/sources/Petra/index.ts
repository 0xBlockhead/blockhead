import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { petraBindings } from '$/sources/Petra/bindings.ts'

export default {
	provider: SourceProvider.Petra,
	label: 'Petra',
	sources: [
		{
			provider: SourceProvider.Petra,
			source: Source.Petra_WalletApi,
			label: 'Petra wallet API',
		},
	],
	bindings: petraBindings,
} satisfies SourceProviderDefinition
