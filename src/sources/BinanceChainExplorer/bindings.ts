// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.BinanceChainExplorer_Rest]: {
		source: Source.BinanceChainExplorer_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'binance-chain-explorer',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://explorer.binance.org',
				origin: 'https://explorer.binance.org',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["BinanceChainExplorer_Rest","Global","binance-chain-explorer","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
