// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	flatMapSourceBindings,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const blockscoutRestV2BindingAxes = {
	source: Source.Blockscout_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.BlockscoutRestV2,
	operationGroups: [
		SourceOperationGroup.BlockscoutAccountAbstraction,
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.GenerationManifest,
			path: 'src/sources/Blockscout/OpenApi/schema-source.ts',
		},
		{
			kind: SourceArtifactKind.OpenApiSpec,
			path: 'src/sources/Blockscout/OpenApi/openapi.yaml',
		},
		{
			kind: SourceArtifactKind.OpenApiTypes,
			path: 'src/sources/Blockscout/OpenApi/openapi.d.ts',
			generated: true,
		},
	],
} as const
const blockscoutRestEvmExecutionJsonRpcBindingAxes = {
	source: Source.Blockscout_Rest,
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.EvmExecutionJsonRpc,
	operationGroups: [
		SourceOperationGroup.EvmRpcCore,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.GenerationManifest,
			path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
		},
		{
			kind: SourceArtifactKind.OpenRpcSpec,
			path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
		},
	],
} as const

export default indexSourceBindings(flatMapSourceBindings(
	[
		{
			key: '1',
			locator: 'https://eth.blockscout.com',
		},
		{
			key: '10',
			locator: 'https://optimism.blockscout.com',
		},
		{
			key: '100',
			locator: 'https://gnosis.blockscout.com',
		},
		{
			key: '137',
			locator: 'https://polygon.blockscout.com',
		},
		{
			key: '8453',
			locator: 'https://base.blockscout.com',
		},
		{
			key: '42161',
			locator: 'https://arbitrum.blockscout.com',
		},
		{
			key: '11155111',
			locator: 'https://eth-sepolia.blockscout.com',
		},
	] as const,
	({
		key,
		locator,
	}) => ([
		{
			...blockscoutRestV2BindingAxes,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key,
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator,
					corsEnabled: false,
				},
			],
		},
		{
			...blockscoutRestEvmExecutionJsonRpcBindingAxes,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key,
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: `${locator}/api/eth-rpc`,
					corsEnabled: false,
				},
			],
		},
	] as const)
))
