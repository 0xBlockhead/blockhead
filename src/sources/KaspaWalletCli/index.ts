import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { kaspaWalletCliBindings } from '$/sources/KaspaWalletCli/bindings.ts'

export default {
	provider: SourceProvider.KaspaWalletCli,
	label: 'Kaspa wallet CLI',
	sources: [
		{
			provider: SourceProvider.KaspaWalletCli,
			source: Source.KaspaWalletCli_WalletApi,
			label: 'Kaspa wallet CLI API',
		},
	],
	bindings: kaspaWalletCliBindings,
} satisfies SourceProviderDefinition
