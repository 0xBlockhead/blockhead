// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const rssRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const rssRestCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const rssRestArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/Rss/Rest/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.Rss_Rest]: [
		{
			source: Source.Rss_Rest,
			target: {
				kind: SourceTargetKind.Feed,
				key: 'https://hnrss.org',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://hnrss.org',
					origin: 'https://hnrss.org',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: rssRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: rssRestCredentials,
			proxyId: '["Rss_Rest","Feed","https://hnrss.org","HttpProxy","RestJson"]',
			artifacts: rssRestArtifacts,
		},
		{
			source: Source.Rss_Rest,
			target: {
				kind: SourceTargetKind.Feed,
				key: 'https://feeds.bbci.co.uk',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://feeds.bbci.co.uk',
					origin: 'https://feeds.bbci.co.uk',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: rssRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: rssRestCredentials,
			proxyId: '["Rss_Rest","Feed","https://feeds.bbci.co.uk","HttpProxy","RestJson"]',
			artifacts: rssRestArtifacts,
		},
	],
} as const satisfies SourceBindingIndex
