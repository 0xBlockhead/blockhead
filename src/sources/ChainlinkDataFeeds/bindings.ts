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
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const chainlinkDataFeedsGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const

export default indexSourceBindings([
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
		operationGroups: chainlinkDataFeedsGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
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
		operationGroups: chainlinkDataFeedsGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[])
