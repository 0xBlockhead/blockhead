// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
	{
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
	{
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
	{
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
	{
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
] as const satisfies readonly SourceBinding[])
