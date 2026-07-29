// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
	},
	{
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
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.Nodely_Algod_Rest]: typeof bindings[0]
	readonly [Source.Nodely_AlgorandIndexer_Rest]: typeof bindings[1]
}>(bindings)
