import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { zeroGBindings } from '$/sources/ZeroG/bindings.ts'

export const zeroGStorageNodeRpcEndpoints = zeroGBindings
	.filter((binding) => binding.source === Source.ZeroGStorageNode_JsonRpc)
	.flatMap((binding) => binding.endpoints)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: TransportType.Http,
		providerName: 'Local 0G storage node',
	}))
