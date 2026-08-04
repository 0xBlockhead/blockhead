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
		source: Source.Euler_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'euler-v3-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://v3.euler.finance',
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
				path: 'src/sources/Euler/Rest/types.ts',
				referenceUrl: 'https://docs.euler.finance/developers/data-querying/euler-v3-api',
			},
		],
	},
])
