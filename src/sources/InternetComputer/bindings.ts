// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.IcDashboard_Canister]: {
		source: Source.IcDashboard_Canister,
		target: {
			kind: SourceTargetKind.Canister,
			key: 'ic-dashboard',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.CanisterId,
				locator: 'env:IC_DASHBOARD_CANISTER_ID',
			},
		],
		wireProtocol: WireProtocol.Canister,
		apiFamily: ApiFamily.IcCanister,
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
	[Source.InternetComputer_Canister]: {
		source: Source.InternetComputer_Canister,
		target: {
			kind: SourceTargetKind.Canister,
			key: 'application-canister',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.CanisterId,
				locator: 'env:IC_CANISTER_ID',
			},
		],
		wireProtocol: WireProtocol.Canister,
		apiFamily: ApiFamily.IcCanister,
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
	[Source.InternetComputer_Http]: {
		source: Source.InternetComputer_Http,
		target: {
			kind: SourceTargetKind.Global,
			key: 'internet-computer-boundary',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:IC_BOUNDARY_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.CertifiedHttpGateway,
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
	[Source.InternetComputer_RosettaApi]: {
		source: Source.InternetComputer_RosettaApi,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'icp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:IC_ROSETTA_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RosettaApi,
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
	[Source.InternetComputer_WalletApi]: {
		source: Source.InternetComputer_WalletApi,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'user-session',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.BrowserWalletProvider,
				locator: 'browser:internet-computer-wallet',
			},
		],
		wireProtocol: WireProtocol.WalletProvider,
		apiFamily: ApiFamily.WalletApi,
		operationGroups: [
			SourceOperationGroup.WalletAccountRead,
			SourceOperationGroup.WalletSign,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
} as const satisfies SourceBindingIndex
