import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { moneroWalletRpcBindings } from '$/sources/MoneroWalletRpc/bindings.ts'

export default {
	provider: SourceProvider.MoneroWalletRpc,
	label: 'Monero wallet RPC',
	sources: [
		{
			provider: SourceProvider.MoneroWalletRpc,
			source: Source.MoneroWalletRpc_JsonRpc,
			label: 'Monero wallet JSON-RPC',
		},
	],
	bindings: moneroWalletRpcBindings,
} satisfies SourceProviderDefinition
