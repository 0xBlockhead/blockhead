import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const moneroDaemonRpcBindings: readonly SourceBinding[] = [
	{
		provider: SourceProvider.MoneroDaemonRpc,
		source: Source.MoneroDaemonRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'monero:mainnet',
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
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/MoneroDaemonRpc/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
	{
		provider: SourceProvider.MoneroDaemonRpc,
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
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/MoneroDaemonRpc/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
]
