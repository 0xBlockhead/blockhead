// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.HyperliquidDocs_Rest]: {
		source: Source.HyperliquidDocs_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'hyperliquid-docs',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hyperliquid.gitbook.io',
				origin: 'https://hyperliquid.gitbook.io',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.StaticWebsite,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
} as const satisfies SourceBindingIndex
