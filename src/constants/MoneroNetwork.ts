import { TransportType } from '$/constants/TransportType.ts'


// Constants

export const moneroDaemonDefaultRpcUrl = 'https://xmr-node.cakewallet.com:18081/json_rpc'

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
