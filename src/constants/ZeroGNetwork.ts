import { TransportType } from '$/constants/TransportType.ts'


// Constants

export const zeroGChainId = 16661

export const zeroGMainnetRpcEndpoints = [
	{
		url: 'https://evmrpc.0g.ai',
		transportType: TransportType.Http,
		providerName: '0G',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export const zeroGMainnetExplorerEndpoints = [
	{
		url: 'https://chainscan.0g.ai',
		transportType: TransportType.Http,
		providerName: '0G ChainScan',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export const zeroGMainnetStorageEndpoints = [
	{
		url: 'https://storagescan.0g.ai',
		transportType: TransportType.Http,
		providerName: '0G StorageScan',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]
