import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { walletStandardBindings } from '$/sources/WalletStandard/bindings.ts'

export default {
	provider: SourceProvider.WalletStandard,
	label: 'Wallet Standard',
	sources: [
		{
			provider: SourceProvider.WalletStandard,
			source: Source.WalletStandard_WalletApi,
			label: 'Wallet Standard API',
		},
	],
	bindings: walletStandardBindings,
} satisfies SourceProviderDefinition
