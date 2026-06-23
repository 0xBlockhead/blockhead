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
import { nodeEndpoints } from '$/sources/Snapchain/Rest/constants.ts'

export const snapchainBindings = [
	{
		provider: SourceProvider.Snapchain,
		source: Source.Snapchain_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'farcaster-snapchain',
		},
		endpoints: nodeEndpoints.map((endpoint) => ({
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: endpoint.url,
			origin: new URL(endpoint.url).origin,
			corsEnabled: false,
		})),
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
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
				path: 'src/sources/Snapchain/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
