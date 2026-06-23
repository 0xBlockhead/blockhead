import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tronTip1193Bindings } from '$/sources/TronTip1193/bindings.ts'

export default {
	provider: SourceProvider.TronTip1193,
	label: 'TRON TIP-1193',
	sources: [
		{
			provider: SourceProvider.TronTip1193,
			source: Source.TronTip1193_WalletApi,
			label: 'TRON TIP-1193 wallet API',
		},
	],
	bindings: tronTip1193Bindings,
} satisfies SourceProviderDefinition
