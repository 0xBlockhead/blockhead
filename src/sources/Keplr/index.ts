import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { keplrBindings } from '$/sources/Keplr/bindings.ts'

export default {
	provider: SourceProvider.Keplr,
	label: 'Keplr',
	sources: [
		{
			provider: SourceProvider.Keplr,
			source: Source.Keplr_WalletApi,
			label: 'Keplr wallet API',
		},
	],
	bindings: keplrBindings,
} satisfies SourceProviderDefinition
