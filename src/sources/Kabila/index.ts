import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { kabilaBindings } from '$/sources/Kabila/bindings.ts'

export default {
	provider: SourceProvider.Kabila,
	label: 'Kabila',
	sources: [
		{
			provider: SourceProvider.Kabila,
			source: Source.Kabila_WalletConnect,
			label: 'Kabila WalletConnect',
		},
	],
	bindings: kabilaBindings,
} satisfies SourceProviderDefinition
