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

export const lotusBindings: readonly SourceBinding[] = [
	{
		provider: SourceProvider.Lotus,
		source: Source.Lotus_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'fil:mainnet',
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
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Lotus/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
	{
		provider: SourceProvider.Lotus,
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
				path: 'src/sources/Lotus/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
]
