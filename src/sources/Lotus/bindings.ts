// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const lotusJsonRpcGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const lotusJsonRpcArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/Lotus/JsonRpc/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.Lotus_JsonRpc]: [
		{
			source: Source.Lotus_JsonRpc,
			target: {
				kind: SourceTargetKind.Caip2Network,
				key: 'fil:f',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.node.glif.io',
					origin: 'https://api.node.glif.io',
					corsEnabled: true,
				},
			],
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.FilecoinLotusJsonRpc,
			operationGroups: lotusJsonRpcGenericReadOperationGroups,
			delivery: SourceDelivery.BrowserDirect,
			credentials: [
				{
					scope: SourceCredentialScope.None,
				},
			],
			artifacts: lotusJsonRpcArtifacts,
		},
		{
			source: Source.Lotus_JsonRpc,
			target: {
				kind: SourceTargetKind.LocalDevice,
				key: 'local-lotus',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'http://127.0.0.1:1234',
					origin: 'http://127.0.0.1:1234',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.FilecoinLotusJsonRpc,
			operationGroups: lotusJsonRpcGenericReadOperationGroups,
			delivery: SourceDelivery.LocalOnly,
			credentials: [
				{
					scope: SourceCredentialScope.LocalSecret,
				},
			],
			artifacts: lotusJsonRpcArtifacts,
		},
	],
} as const satisfies SourceBindingIndex
