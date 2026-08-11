import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	mapSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings(mapSourceBindings(
	[
		'uniswap-v3-evm-contract-catalog',
		'uniswap-cca-v2-contract-interface',
	] as const,
	(key) => ({
		source: Source.UniswapContracts_Evm,
		target: {
			kind: SourceTargetKind.Global,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: key,
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.CatalogRows,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
	})
))
