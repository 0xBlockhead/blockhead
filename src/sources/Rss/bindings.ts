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

const rssRestRestJsonHttpProxyBindingAxes = {
	source: Source.Rss_Rest,
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
			path: 'src/sources/Rss/Rest/types.ts',
		},
	],
} as const

const rssRestTargets = [
	{
		key: 'https://hnrss.org',
		locator: 'https://hnrss.org',
	},
	{
		key: 'https://feeds.bbci.co.uk',
		locator: 'https://feeds.bbci.co.uk',
	},
] as const

const bindings = rssRestTargets.map(({
	key,
	locator,
}) => ({
		...rssRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator,
				corsEnabled: false,
			},
		],
})) satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
