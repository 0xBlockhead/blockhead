import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const hyperliquidDocsOrigin = 'https://hyperliquid.gitbook.io' as const

export const hyperliquidDocsBindings = [
	{
		provider: SourceProvider.HyperliquidDocs,
		source: Source.HyperliquidDocs_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'hyperliquid-docs',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: hyperliquidDocsOrigin,
				origin: hyperliquidDocsOrigin,
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
] as const satisfies readonly SourceBinding[]
