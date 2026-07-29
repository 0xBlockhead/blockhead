// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Pyth_EvmContract,
		target: {
			kind: SourceTargetKind.Global,
			key: 'pyth-evm-contract-catalog',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'pyth-evm-contract-catalog',
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
		source: Source.Pyth_SolanaProgram,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'pyth-solana-program-catalog',
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
		source: Source.PythHermes_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'pyth-hermes',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hermes.pyth.network',
				origin: 'https://hermes.pyth.network',
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
		source: Source.PythBenchmarks_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'pyth-benchmarks',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://benchmarks.pyth.network',
				origin: 'https://benchmarks.pyth.network',
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
		source: Source.PythPriceFeedsCatalog_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'pyth-price-feeds-catalog',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://benchmarks.pyth.network',
				origin: 'https://benchmarks.pyth.network',
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
	readonly [Source.Pyth_EvmContract]: typeof bindings[0]
	readonly [Source.Pyth_SolanaProgram]: typeof bindings[1]
	readonly [Source.PythHermes_Rest]: typeof bindings[2]
	readonly [Source.PythBenchmarks_Rest]: typeof bindings[3]
	readonly [Source.PythPriceFeedsCatalog_Rest]: typeof bindings[4]
}>(bindings)
