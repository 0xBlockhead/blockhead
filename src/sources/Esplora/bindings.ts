// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const esploraRestBindingAxes = {
	source: Source.Esplora_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
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
] as const satisfies readonly SourceBinding[])
