// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Nodely_Algod_Rest]: {
		source: Source.Nodely_Algod_Rest,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'algorand',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet-api.4160.nodely.dev',
				origin: 'https://mainnet-api.4160.nodely.dev',
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
		proxyId: '["Nodely_Algod_Rest","NetworkSlug","algorand","HttpProxy","RestJson"]',
	},
	[Source.Nodely_AlgorandIndexer_Rest]: {
		source: Source.Nodely_AlgorandIndexer_Rest,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'algorand',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet-idx.4160.nodely.dev',
				origin: 'https://mainnet-idx.4160.nodely.dev',
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
		proxyId: '["Nodely_AlgorandIndexer_Rest","NetworkSlug","algorand","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
