import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'


// Constants

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


// Source

export default {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGChain_JsonRpc,
	label: '0G Chain JSON-RPC',
} as const
