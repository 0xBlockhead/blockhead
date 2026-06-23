import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { litecoinWalletRpcBindings } from '$/sources/LitecoinWalletRpc/bindings.ts'

export default {
	provider: SourceProvider.LitecoinWalletRpc,
	label: 'Litecoin wallet RPC',
	sources: [
		{
			provider: SourceProvider.LitecoinWalletRpc,
			source: Source.LitecoinWalletRpc_JsonRpc,
			label: 'Litecoin wallet JSON-RPC',
		},
	],
	bindings: litecoinWalletRpcBindings,
} satisfies SourceProviderDefinition
