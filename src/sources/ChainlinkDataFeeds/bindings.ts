// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.ChainlinkDataFeeds_AddressCatalog,
		target: {
			kind: SourceTargetKind.Global,
			key: 'chainlink-data-feeds-address-catalog',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'chainlink-data-feeds-address-catalog',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.CatalogRows,
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
	{
		source: Source.ChainlinkDataFeeds_Contracts,
		target: {
			kind: SourceTargetKind.Global,
			key: 'chainlink-data-feeds-contract-catalog',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'chainlink-data-feeds-contract-catalog',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.CatalogRows,
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

export default indexSourceBindings<{
	readonly [Source.ChainlinkDataFeeds_AddressCatalog]: typeof bindings[0]
	readonly [Source.ChainlinkDataFeeds_Contracts]: typeof bindings[1]
}>(bindings)
