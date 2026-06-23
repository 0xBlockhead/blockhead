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

const nearRpcOrigin = 'https://rpc.mainnet.near.org' as const

export const nearRpcBindings = [
	{
		provider: SourceProvider.NearRpc,
		source: Source.NearRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'near:mainnet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: nearRpcOrigin,
				origin: nearRpcOrigin,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
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
				path: 'src/sources/NearRpc/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
