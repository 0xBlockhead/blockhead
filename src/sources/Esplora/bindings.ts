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

const esploraRestBindingAxes = {
	source: Source.Esplora_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
} as const

export default indexSourceBindings([
	{
		...esploraRestBindingAxes,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'bip122:000000000019d6689c085ae165831e93',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://blockstream.info/api',
				corsEnabled: true,
			},
		],
	},
	{
		...esploraRestBindingAxes,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'bip122:000000000933ea01ad0ee984209779ba',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://blockstream.info/testnet/api',
				corsEnabled: true,
			},
		],
	},
	{
		...esploraRestBindingAxes,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'liquid',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://blockstream.info/liquid/api',
				corsEnabled: true,
			},
		],
	},
])
