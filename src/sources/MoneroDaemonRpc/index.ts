import { TransportType } from '$/constants/TransportType.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import MoneroDaemonRpcJsonRpc from '$/sources/MoneroDaemonRpc/JsonRpc/index.ts'


// Constants

export const moneroMainnetRpcEndpoints = [
	{
		url: 'https://xmr-node.cakewallet.com:18081/json_rpc',
		transportType: TransportType.Http,
		providerName: 'Cake Wallet public Monero node',
	},
	{
		url: 'http://nodes.hashvault.pro:18081/json_rpc',
		transportType: TransportType.Http,
		providerName: 'Hashvault public Monero node',
	},
	{
		url: 'http://127.0.0.1:18081/json_rpc',
		transportType: TransportType.Http,
		providerName: 'Local monerod',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Provider

export default {
	provider: SourceProvider.MoneroDaemonRpc,
	label: 'Monero daemon RPC',
	origins: moneroMainnetRpcEndpoints.map((endpoint) => ({
		origin: new URL(endpoint.url).origin,
		corsEnabled: false,
	})),
	sources: [
		MoneroDaemonRpcJsonRpc,
	],
} as const satisfies SourceProviderDefinition
