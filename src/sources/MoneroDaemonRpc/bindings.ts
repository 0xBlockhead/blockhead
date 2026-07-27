// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const moneroDaemonRpcJsonRpcGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const moneroDaemonRpcJsonRpcArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/MoneroDaemonRpc/JsonRpc/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.MoneroDaemonRpc_JsonRpc]: [
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
					origin: 'https://xmr-node.cakewallet.com:18081',
					corsEnabled: false,
				},
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'http://nodes.hashvault.pro:18081/json_rpc',
					origin: 'http://nodes.hashvault.pro:18081',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.MoneroDaemonJsonRpc,
			operationGroups: moneroDaemonRpcJsonRpcGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: [
				{
					scope: SourceCredentialScope.None,
				},
			],
			proxyId: '["MoneroDaemonRpc_JsonRpc","Caip2Network","monero:418015bb9ae982a1975da7d79277c270","HttpProxy","MoneroDaemonJsonRpc"]',
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
					origin: 'http://127.0.0.1:18081',
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
	],
} as const satisfies SourceBindingIndex
