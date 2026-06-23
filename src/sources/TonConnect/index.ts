import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tonConnectBindings } from '$/sources/TonConnect/bindings.ts'

export default {
	provider: SourceProvider.TonConnect,
	label: 'TonConnect',
	sources: [
		{
			provider: SourceProvider.TonConnect,
			source: Source.TonConnect_WalletApi,
			label: 'TonConnect wallet API',
		},
	],
	bindings: tonConnectBindings,
} satisfies SourceProviderDefinition
