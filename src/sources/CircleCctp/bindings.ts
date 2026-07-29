// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.CircleCctp_IrisApi,
		target: {
			kind: SourceTargetKind.Global,
			key: 'circle-cctp-iris-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{circle-iris-api-host}',
				origin: 'https://{circle-iris-api-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
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
		source: Source.CircleCctpContracts_Evm,
		target: {
			kind: SourceTargetKind.Global,
			key: 'circle-cctp-evm-contract-catalog',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'circle-cctp-evm-contract-catalog',
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
		source: Source.CircleCctpContracts_Solana,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'circle-cctp-solana-program-catalog',
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
		source: Source.CircleCctpContracts_Stellar,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'stellar',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'circle-cctp-stellar-contract-catalog',
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
	readonly [Source.CircleCctp_IrisApi]: typeof bindings[0]
	readonly [Source.CircleCctpContracts_Evm]: typeof bindings[1]
	readonly [Source.CircleCctpContracts_Solana]: typeof bindings[2]
	readonly [Source.CircleCctpContracts_Stellar]: typeof bindings[3]
}>(bindings)
