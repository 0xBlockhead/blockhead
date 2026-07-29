// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.DydxIndexer_Rest,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'dydx',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{dydx-indexer-host}',
				origin: 'https://{dydx-indexer-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.DydxIndexerRest,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		source: Source.DydxValidator_Rest,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'dydx',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{dydx-validator-rest-host}',
				origin: 'https://{dydx-validator-rest-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.CosmosLcdApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.DydxIndexer_Rest]: typeof bindings[0]
	readonly [Source.DydxValidator_Rest]: typeof bindings[1]
}>(bindings)
