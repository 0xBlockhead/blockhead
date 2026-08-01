// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
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
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Mastodon/Rest/types.ts',
		},
	],
} as const

const bindings = [
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
