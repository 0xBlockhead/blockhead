// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const compoundRestBindingAxes = {
	source: Source.Compound_Rest,
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

export default indexSourceBindings([
	{
		source: Source.Compound_Rest,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'compound-finance/comet@f766f51583c23acc33b2a7824654ef2029a96804:deployments',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://raw.githubusercontent.com/compound-finance/comet/f766f51583c23acc33b2a7824654ef2029a96804/',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Compound/Rest/types.ts',
				referenceUrl: 'https://docs.compound.finance/',
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum.publicnode.com',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '10',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.optimism.io',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '130',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://unichain-rpc.publicnode.com',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '137',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://polygon-rpc.com',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '2020',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.roninchain.com/rpc',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '5000',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.mantle.xyz',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '8453',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.base.org',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42161',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arb1.arbitrum.io/rpc',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '59144',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.linea.build',
				corsEnabled: false,
			},
		],
	},
	{
		...compoundRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '534352',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.scroll.io',
				corsEnabled: false,
			},
		],
	},
])
