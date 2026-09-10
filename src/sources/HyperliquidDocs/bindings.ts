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
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.HyperliquidDocs_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'hyperliquid-docs',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hyperliquid.gitbook.io',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.StaticWebsite,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
	},
])
