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
import { blobscanRestApiOrigins } from '$/sources/Blobscan/Rest/constants.ts'

export const blobscanBindings = blobscanRestApiOrigins.map((endpoint): SourceBinding => ({
	provider: SourceProvider.Blobscan,
	source: Source.Blobscan_Rest,
	target: {
		kind: SourceTargetKind.Eip155Chain,
		key: String(endpoint.chainId),
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: endpoint.origin,
			origin: endpoint.origin,
			corsEnabled: endpoint.corsEnabled,
		},
	],
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
			path: 'src/sources/Blobscan/Rest/types.ts',
			generated: false,
		},
	],
}))
