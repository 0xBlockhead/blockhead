import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bitcoinCoreBindings } from '$/sources/BitcoinCore/bindings.ts'

export default {
	provider: SourceProvider.BitcoinCore,
	label: 'Bitcoin Core',
	sources: [
		{
			provider: SourceProvider.BitcoinCore,
			source: Source.BitcoinCore_JsonRpc,
			label: 'Bitcoin Core JSON-RPC',
		},
	],
	bindings: bitcoinCoreBindings,
} satisfies SourceProviderDefinition
