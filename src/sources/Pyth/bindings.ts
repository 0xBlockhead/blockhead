// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Pyth_EvmContract]: {
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
	[Source.Pyth_SolanaProgram]: {
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
	[Source.PythHermes_Rest]: {
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
		proxyId: '["PythHermes_Rest","Global","pyth-hermes","HttpProxy","RestJson"]',
	},
	[Source.PythBenchmarks_Rest]: {
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
		proxyId: '["PythBenchmarks_Rest","Global","pyth-benchmarks","HttpProxy","RestJson"]',
	},
	[Source.PythPriceFeedsCatalog_Rest]: {
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
		proxyId: '["PythPriceFeedsCatalog_Rest","Global","pyth-price-feeds-catalog","HttpProxy","RestJson"]',
	},
} as const satisfies SourceBindingIndex
