import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { aptosAip62Bindings } from '$/sources/AptosAip62/bindings.ts'

export default {
	provider: SourceProvider.AptosAip62,
	label: 'Aptos AIP-62',
	sources: [
		{
			provider: SourceProvider.AptosAip62,
			source: Source.AptosAip62_WalletApi,
			label: 'Aptos AIP-62 wallet API',
		},
	],
	bindings: aptosAip62Bindings,
} satisfies SourceProviderDefinition
