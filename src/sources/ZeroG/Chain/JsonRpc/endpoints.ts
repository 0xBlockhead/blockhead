import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { zeroGBindings } from '$/sources/ZeroG/bindings.ts'

export const zeroGMainnetRpcEndpoints = zeroGBindings
	.filter((binding) => binding.source === Source.ZeroGChain_JsonRpc)
	.flatMap((binding) => binding.endpoints)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: TransportType.Http,
		providerName: '0G',
	}))
