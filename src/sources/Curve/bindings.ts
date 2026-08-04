// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.Curve_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'curve-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.curve.finance',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Curve/Rest/types.ts',
				referenceUrl: 'https://api.curve.finance/v1/documentation/',
			},
		],
	},
])
