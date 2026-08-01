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

const blockscoutRestV2HttpProxyBindingAxes = {
	source: Source.Blockscout_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.BlockscoutRestV2,
	operationGroups: [
		SourceOperationGroup.GenericRead,
		SourceOperationGroup.BlockscoutAccountAbstraction,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.OpenApiSpec,
			path: 'src/sources/Blockscout/OpenApi/openapi.yaml',
		},
		{
			kind: SourceArtifactKind.GenerationManifest,
			path: 'src/sources/Blockscout/OpenApi/schema-source.ts',
		},
		{
			kind: SourceArtifactKind.OpenApiTypes,
			path: 'src/sources/Blockscout/OpenApi/openapi.d.ts',
			generated: true,
		},
	],
} as const
const blockscoutRestEvmExecutionJsonRpcHttpProxyBindingAxes = {
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
			kind: SourceArtifactKind.OpenRpcSpec,
			path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
		},
		{
			kind: SourceArtifactKind.GenerationManifest,
			path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
		},
	],
} as const

const blockscoutRestTargets = [
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
] as const

const bindings = blockscoutRestTargets.flatMap(({
	key,
	locator,
}) => ([
	{
		...blockscoutRestV2HttpProxyBindingAxes,
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
		...blockscoutRestEvmExecutionJsonRpcHttpProxyBindingAxes,
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
] satisfies readonly SourceBinding[]))

export default indexSourceBindings(bindings)
