import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bitcoinCashNodeBindings } from '$/sources/BitcoinCashNode/bindings.ts'

export default {
	provider: SourceProvider.BitcoinCashNode,
	label: 'Bitcoin Cash Node',
	sources: [
		{
			provider: SourceProvider.BitcoinCashNode,
			source: Source.BitcoinCashNode_JsonRpc,
			label: 'Bitcoin Cash Node JSON-RPC',
		},
	],
	bindings: bitcoinCashNodeBindings,
} satisfies SourceProviderDefinition
