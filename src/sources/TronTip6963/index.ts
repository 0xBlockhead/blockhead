import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tronTip6963Bindings } from '$/sources/TronTip6963/bindings.ts'

export default {
	provider: SourceProvider.TronTip6963,
	label: 'TRON TIP-6963',
	sources: [
		{
			provider: SourceProvider.TronTip6963,
			source: Source.TronTip6963_WalletApi,
			label: 'TRON TIP-6963 wallet API',
		},
	],
	bindings: tronTip6963Bindings,
} satisfies SourceProviderDefinition
