import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tronLinkBindings } from '$/sources/TronLink/bindings.ts'

export default {
	provider: SourceProvider.TronLink,
	label: 'TronLink',
	sources: [
		{
			provider: SourceProvider.TronLink,
			source: Source.TronLink_WalletApi,
			label: 'TronLink wallet API',
		},
	],
	bindings: tronLinkBindings,
} satisfies SourceProviderDefinition
