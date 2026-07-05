import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'


// Constants

export const zeroGStorageNodeRpcEndpoints = [
	{
		url: 'http://127.0.0.1:5678',
		transportType: TransportType.Http,
		providerName: 'Local 0G storage node',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Source

export default {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGStorageNode_JsonRpc,
	label: '0G Storage node JSON-RPC',
} as const
