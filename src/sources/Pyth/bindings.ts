// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
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
		credentials: [],
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
		credentials: [],
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
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
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
				locator: 'https://pyth.dourolabs.app/hermes',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Pyth/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Pyth/OpenApi/openapi.json',
				generated: true,
				officialUrl: 'https://pyth.dourolabs.app/docs/hermes/openapi.json',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Pyth/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
])
