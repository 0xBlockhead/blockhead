import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { magicBindings } from '$/sources/Magic/bindings.ts'

export default {
	provider: SourceProvider.Magic,
	label: 'Magic',
	sources: [
		{
			provider: SourceProvider.Magic,
			source: Source.Magic_HederaWalletApi,
			label: 'Magic Hedera wallet API',
		},
	],
	bindings: magicBindings,
} satisfies SourceProviderDefinition
