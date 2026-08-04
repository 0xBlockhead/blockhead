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
		source: Source.Balancer_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'balancer-api-v3',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api-v3.balancer.fi/',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Balancer/Rest/types.ts',
				referenceUrl: 'https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/balancer-api.html',
			},
		],
	},
])
