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
import { rssFeedOrigins } from '$/sources/Rss/Rest/constants.ts'

export const rssBindings = rssFeedOrigins.map((rssFeedOrigin) => ({
	provider: SourceProvider.Rss,
	source: Source.Rss_Rest,
	target: {
		kind: SourceTargetKind.Feed,
		key: rssFeedOrigin.origin,
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: rssFeedOrigin.origin,
			origin: rssFeedOrigin.origin,
			corsEnabled: rssFeedOrigin.corsEnabled,
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
			path: 'src/sources/Rss/Rest/types.ts',
			generated: false,
		},
	],
})) satisfies SourceBinding[]
