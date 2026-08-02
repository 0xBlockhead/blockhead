// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const circleCctpGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const

export default indexSourceBindings([
	{
		source: Source.CircleCctpIris,
		target: {
			kind: SourceTargetKind.Global,
			key: 'circle-cctp-iris-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://iris-api.circle.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: circleCctpGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/CircleCctp/OpenApi/openapi.yaml',
				generated: true,
				officialUrl: 'https://developers.circle.com/openapi/cctp.yaml',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/CircleCctp/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/CircleCctp/OpenApi/openapi.d.ts',
				generated: true,
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
		operationGroups: circleCctpGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
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
		operationGroups: circleCctpGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
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
		operationGroups: circleCctpGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[])
