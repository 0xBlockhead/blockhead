// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

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

const bindings = [
	{
		...rssRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'https://hnrss.org',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hnrss.org',
				corsEnabled: false,
			},
		],
	},
	{
		...rssRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'https://feeds.bbci.co.uk',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://feeds.bbci.co.uk',
				corsEnabled: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
