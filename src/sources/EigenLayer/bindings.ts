// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.EigenLayerContracts_Evm,
		target: {
			kind: SourceTargetKind.Global,
			key: 'eigenlayer-evm-contract-catalog',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'eigenlayer-evm-contract-catalog',
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

export default indexSourceBindings<{ readonly [Source.EigenLayerContracts_Evm]: typeof bindings[0] }>(bindings)
