import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { hashConnectBindings } from '$/sources/HashConnect/bindings.ts'

export default {
	provider: SourceProvider.HashConnect,
	label: 'HashConnect',
	sources: [
		{
			provider: SourceProvider.HashConnect,
			source: Source.HashConnect_WalletApi,
			label: 'HashConnect wallet API',
		},
	],
	bindings: hashConnectBindings,
} satisfies SourceProviderDefinition
