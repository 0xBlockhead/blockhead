import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const mastodonRestEndpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://fosstodon.org',
		corsEnabled: false,
	},
] as const

const mastodonRestBindingAxes = {
	source: Source.Mastodon_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Mastodon/Rest/types.ts',
		},
	],
} as const

export default indexSourceBindings([
	{
		...mastodonRestBindingAxes,
		target: {
			kind: SourceTargetKind.Global,
			key: 'mastodon-instance:https://mastodon.social',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mastodon.social',
				corsEnabled: false,
			},
		],
	},
	{
		...mastodonRestBindingAxes,
		target: {
			kind: SourceTargetKind.Global,
			key: 'mastodon-instance:https://fosstodon.org',
		},
		endpoints: mastodonRestEndpoints,
	},
	{
		...mastodonRestBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'mastodon-public-timeline:https://fosstodon.org',
		},
		endpoints: mastodonRestEndpoints,
	},
])
