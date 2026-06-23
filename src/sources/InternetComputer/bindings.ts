import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const internetComputerBindings = [
	{
		provider: SourceProvider.InternetComputer,
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
	{
		provider: SourceProvider.InternetComputer,
		source: Source.InternetComputer_Canister,
		target: {
			kind: SourceTargetKind.Canister,
			key: 'configured-canister',
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
	{
		provider: SourceProvider.InternetComputer,
		source: Source.InternetComputer_Http,
		target: {
			kind: SourceTargetKind.Global,
			key: 'internet-computer-boundary',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:IC_BOUNDARY_URL',
				origin: 'env:IC_BOUNDARY_URL',
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
	{
		provider: SourceProvider.InternetComputer,
		source: Source.InternetComputer_RosettaApi,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'icp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:IC_ROSETTA_URL',
				origin: 'env:IC_ROSETTA_URL',
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
	{
		provider: SourceProvider.InternetComputer,
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
] as const satisfies readonly SourceBinding[]
