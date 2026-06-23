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
import { rss2JsonApiOrigins } from '$/sources/Rss2Json/Rest/constants.ts'

export const rss2JsonBindings = rss2JsonApiOrigins.map((rss2JsonApiOrigin) => ({
	provider: SourceProvider.Rss2Json,
	source: Source.Rss2Json_Rest,
	target: {
		kind: SourceTargetKind.Global,
		key: 'rss2json',
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: rss2JsonApiOrigin.origin,
			origin: rss2JsonApiOrigin.origin,
			corsEnabled: rss2JsonApiOrigin.corsEnabled,
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
			path: 'src/sources/Rss2Json/Rest/types.ts',
			generated: false,
		},
	],
})) satisfies SourceBinding[]
