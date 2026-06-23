import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { kaspaWalletSdkBindings } from '$/sources/KaspaWalletSdk/bindings.ts'

export default {
	provider: SourceProvider.KaspaWalletSdk,
	label: 'Kaspa wallet SDK',
	sources: [
		{
			provider: SourceProvider.KaspaWalletSdk,
			source: Source.KaspaWalletSdk_WalletApi,
			label: 'Kaspa wallet SDK API',
		},
	],
	bindings: kaspaWalletSdkBindings,
} satisfies SourceProviderDefinition
