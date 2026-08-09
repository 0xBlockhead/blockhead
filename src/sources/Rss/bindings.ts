import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	mapSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const rssRestBindingAxes = {
	source: Source.Rss_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Rss/Rest/types.ts',
		},
	],
} as const

export default indexSourceBindings(mapSourceBindings(
	[
		{
			key: 'https://hnrss.org',
			locator: 'https://hnrss.org',
		},
		{
			key: 'https://feeds.bbci.co.uk',
			locator: 'https://feeds.bbci.co.uk',
		},
	] as const,
	({
		key,
		locator,
	}) => ({
		...rssRestBindingAxes,
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
	})
))
