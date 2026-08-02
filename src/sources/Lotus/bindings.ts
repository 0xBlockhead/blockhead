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

const lotusJsonRpcGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const lotusJsonRpcArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/Lotus/JsonRpc/types.ts',
	},
] as const

export default indexSourceBindings([
	{
		source: Source.Lotus_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'fil:f',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.node.glif.io/rpc/v1',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.FilecoinLotusJsonRpc,
		operationGroups: lotusJsonRpcGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
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
] as const satisfies readonly SourceBinding[])
