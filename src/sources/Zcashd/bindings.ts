// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	walletReadAndSignOperationGroups,
	WireProtocol,
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
		operationGroups: walletReadAndSignOperationGroups,
		delivery: SourceDelivery.LocalOnly,
		credentials: zcashdCredentials,
	},
])
