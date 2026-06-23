import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nearWalletSelectorBindings } from '$/sources/NearWalletSelector/bindings.ts'

export default {
	provider: SourceProvider.NearWalletSelector,
	label: 'NEAR Wallet Selector',
	sources: [
		{
			provider: SourceProvider.NearWalletSelector,
			source: Source.NearWalletSelector_WalletApi,
			label: 'NEAR Wallet Selector API',
		},
	],
	bindings: nearWalletSelectorBindings,
} satisfies SourceProviderDefinition
