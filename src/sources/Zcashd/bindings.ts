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

const zcashdEndpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'http://127.0.0.1:8232',
		corsEnabled: false,
	},
] as const
const zcashdCredentials = [
	{
		scope: SourceCredentialScope.LocalSecret,
	},
] as const

export default indexSourceBindings([
	{
		source: Source.Zcashd_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'bip122:00040fe8ec8471911baa1db1266ea15',
		},
		endpoints: zcashdEndpoints,
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.BitcoinJsonRpc,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.LocalOnly,
		credentials: zcashdCredentials,
	},
	{
		source: Source.ZcashdWallet_JsonRpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'wallet-rpc',
		},
		endpoints: zcashdEndpoints,
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
		operationGroups: [
			SourceOperationGroup.WalletAccountRead,
			SourceOperationGroup.WalletSign,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: zcashdCredentials,
	},
] as const satisfies readonly SourceBinding[])
