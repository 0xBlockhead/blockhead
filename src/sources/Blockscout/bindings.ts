// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const blockscoutRestEip155Chain1Endpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://eth.blockscout.com',
		origin: 'https://eth.blockscout.com',
		corsEnabled: false,
	},
] as const
const blockscoutRestEip155Chain10Endpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://optimism.blockscout.com',
		origin: 'https://optimism.blockscout.com',
		corsEnabled: false,
	},
] as const
const blockscoutRestEip155Chain100Endpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://gnosis.blockscout.com',
		origin: 'https://gnosis.blockscout.com',
		corsEnabled: false,
	},
] as const
const blockscoutRestEip155Chain137Endpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://polygon.blockscout.com',
		origin: 'https://polygon.blockscout.com',
		corsEnabled: false,
	},
] as const
const blockscoutRestEip155Chain8453Endpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://base.blockscout.com',
		origin: 'https://base.blockscout.com',
		corsEnabled: false,
	},
] as const
const blockscoutRestEip155Chain42161Endpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://arbitrum.blockscout.com',
		origin: 'https://arbitrum.blockscout.com',
		corsEnabled: false,
	},
] as const
const blockscoutRestEip155Chain11155111Endpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://eth-sepolia.blockscout.com',
		origin: 'https://eth-sepolia.blockscout.com',
		corsEnabled: false,
	},
] as const
const blockscoutRestGenericReadBlockscoutAccountAbstractionOperationGroups = [
	SourceOperationGroup.GenericRead,
	SourceOperationGroup.BlockscoutAccountAbstraction,
] as const
const blockscoutRestEtherscanAccountModuleEtherscanContractModuleOperationGroups = [
	SourceOperationGroup.EtherscanAccountModule,
	SourceOperationGroup.EtherscanContractModule,
] as const
const blockscoutRestCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const

export default {
	[Source.Blockscout_Rest]: [
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '1',
			},
			endpoints: blockscoutRestEip155Chain1Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.BlockscoutRestV2,
			operationGroups: blockscoutRestGenericReadBlockscoutAccountAbstractionOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","1","HttpProxy","BlockscoutRestV2"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '1',
			},
			endpoints: blockscoutRestEip155Chain1Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.EtherscanModuleAction,
			operationGroups: blockscoutRestEtherscanAccountModuleEtherscanContractModuleOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","1","HttpProxy","EtherscanModuleAction"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '10',
			},
			endpoints: blockscoutRestEip155Chain10Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.BlockscoutRestV2,
			operationGroups: blockscoutRestGenericReadBlockscoutAccountAbstractionOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","10","HttpProxy","BlockscoutRestV2"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '10',
			},
			endpoints: blockscoutRestEip155Chain10Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.EtherscanModuleAction,
			operationGroups: blockscoutRestEtherscanAccountModuleEtherscanContractModuleOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","10","HttpProxy","EtherscanModuleAction"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '100',
			},
			endpoints: blockscoutRestEip155Chain100Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.BlockscoutRestV2,
			operationGroups: blockscoutRestGenericReadBlockscoutAccountAbstractionOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","100","HttpProxy","BlockscoutRestV2"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '100',
			},
			endpoints: blockscoutRestEip155Chain100Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.EtherscanModuleAction,
			operationGroups: blockscoutRestEtherscanAccountModuleEtherscanContractModuleOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","100","HttpProxy","EtherscanModuleAction"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '137',
			},
			endpoints: blockscoutRestEip155Chain137Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.BlockscoutRestV2,
			operationGroups: blockscoutRestGenericReadBlockscoutAccountAbstractionOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","137","HttpProxy","BlockscoutRestV2"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '137',
			},
			endpoints: blockscoutRestEip155Chain137Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.EtherscanModuleAction,
			operationGroups: blockscoutRestEtherscanAccountModuleEtherscanContractModuleOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","137","HttpProxy","EtherscanModuleAction"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '8453',
			},
			endpoints: blockscoutRestEip155Chain8453Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.BlockscoutRestV2,
			operationGroups: blockscoutRestGenericReadBlockscoutAccountAbstractionOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","8453","HttpProxy","BlockscoutRestV2"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '8453',
			},
			endpoints: blockscoutRestEip155Chain8453Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.EtherscanModuleAction,
			operationGroups: blockscoutRestEtherscanAccountModuleEtherscanContractModuleOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","8453","HttpProxy","EtherscanModuleAction"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '42161',
			},
			endpoints: blockscoutRestEip155Chain42161Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.BlockscoutRestV2,
			operationGroups: blockscoutRestGenericReadBlockscoutAccountAbstractionOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","42161","HttpProxy","BlockscoutRestV2"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '42161',
			},
			endpoints: blockscoutRestEip155Chain42161Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.EtherscanModuleAction,
			operationGroups: blockscoutRestEtherscanAccountModuleEtherscanContractModuleOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","42161","HttpProxy","EtherscanModuleAction"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '11155111',
			},
			endpoints: blockscoutRestEip155Chain11155111Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.BlockscoutRestV2,
			operationGroups: blockscoutRestGenericReadBlockscoutAccountAbstractionOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","11155111","HttpProxy","BlockscoutRestV2"]',
		},
		{
			source: Source.Blockscout_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '11155111',
			},
			endpoints: blockscoutRestEip155Chain11155111Endpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.EtherscanModuleAction,
			operationGroups: blockscoutRestEtherscanAccountModuleEtherscanContractModuleOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blockscoutRestCredentials,
			proxyId: '["Blockscout_Rest","Eip155Chain","11155111","HttpProxy","EtherscanModuleAction"]',
		},
	],
} as const satisfies SourceBindingIndex
