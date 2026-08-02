// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const moneroDaemonRpcJsonRpcGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const moneroDaemonRpcJsonRpcArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/MoneroDaemonRpc/JsonRpc/types.ts',
	},
] as const

export default indexSourceBindings([
	{
		source: Source.MoneroDaemonRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'monero:418015bb9ae982a1975da7d79277c270',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://xmr-node.cakewallet.com:18081/json_rpc',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://nodes.hashvault.pro:18081/json_rpc',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.MoneroDaemonJsonRpc,
		operationGroups: moneroDaemonRpcJsonRpcGenericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: moneroDaemonRpcJsonRpcArtifacts,
	},
	{
		source: Source.MoneroDaemonRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'local-monerod',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:18081/json_rpc',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.MoneroDaemonJsonRpc,
		operationGroups: moneroDaemonRpcJsonRpcGenericReadOperationGroups,
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
		artifacts: moneroDaemonRpcJsonRpcArtifacts,
	},
] as const satisfies readonly SourceBinding[])
