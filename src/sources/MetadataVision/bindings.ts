// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.MetadataVision_Rest]: {
		source: Source.MetadataVision_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'open-graph',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://og.metadata.vision',
				origin: 'https://og.metadata.vision',
				corsEnabled: false,
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
		proxyId: '["MetadataVision_Rest","Global","open-graph","HttpProxy","RestJson"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/MetadataVision/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
