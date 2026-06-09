import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import MoneroDaemonRpcJsonRpc from '$/sources/MoneroDaemonRpc/JsonRpc/index.ts'

export default {
	provider: SourceProvider.MoneroDaemonRpc,
	label: 'Monero daemon RPC',
	origins: [
		{
			origin: 'https://xmr-node.cakewallet.com:18081',
			corsEnabled: false,
		},
		{
			origin: 'http://nodes.hashvault.pro:18081',
			corsEnabled: false,
		},
		{
			origin: 'http://127.0.0.1:18081',
			corsEnabled: false,
		},
	],
	sources: [
		MoneroDaemonRpcJsonRpc,
	],
} as const satisfies SourceProviderDefinition
