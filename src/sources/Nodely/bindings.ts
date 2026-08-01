// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const nodelyGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const

const bindings = [
	{
		source: Source.Nodely,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'algorand',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet-api.4160.nodely.dev',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.AlgodRestApi,
		operationGroups: nodelyGenericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
	},
	{
		source: Source.Nodely,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'algorand',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet-idx.4160.nodely.dev',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.AlgorandIndexerRestApi,
		operationGroups: nodelyGenericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
