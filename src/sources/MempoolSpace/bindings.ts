import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const mempoolSpaceRestBindingAxes = {
	source: Source.MempoolSpace_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
} as const

export default indexSourceBindings([
	{
		...mempoolSpaceRestBindingAxes,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'bip122:000000000019d6689c085ae165831e93',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mempool.space/api',
				corsEnabled: true,
			},
		],
	},
	{
		...mempoolSpaceRestBindingAxes,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'bip122:000000000933ea01ad0ee984209779ba',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mempool.space/testnet/api',
				corsEnabled: true,
			},
		],
	},
])
