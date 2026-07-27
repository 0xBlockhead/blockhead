// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const mastodonRestGlobalMastodonInstanceHttpsFosstodonOrgEndpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://fosstodon.org',
		origin: 'https://fosstodon.org',
		corsEnabled: false,
	},
] as const
const mastodonRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const mastodonRestCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const mastodonRestArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/Mastodon/Rest/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.Mastodon_Rest]: [
		{
			source: Source.Mastodon_Rest,
			target: {
				kind: SourceTargetKind.Global,
				key: 'mastodon-instance:https://mastodon.social',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://mastodon.social',
					origin: 'https://mastodon.social',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: mastodonRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: mastodonRestCredentials,
			proxyId: '["Mastodon_Rest","Global","mastodon-instance:https://mastodon.social","HttpProxy","RestJson"]',
			artifacts: mastodonRestArtifacts,
		},
		{
			source: Source.Mastodon_Rest,
			target: {
				kind: SourceTargetKind.Global,
				key: 'mastodon-instance:https://fosstodon.org',
			},
			endpoints: mastodonRestGlobalMastodonInstanceHttpsFosstodonOrgEndpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: mastodonRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: mastodonRestCredentials,
			proxyId: '["Mastodon_Rest","Global","mastodon-instance:https://fosstodon.org","HttpProxy","RestJson"]',
			artifacts: mastodonRestArtifacts,
		},
		{
			source: Source.Mastodon_Rest,
			target: {
				kind: SourceTargetKind.Feed,
				key: 'mastodon-public-timeline:https://fosstodon.org',
			},
			endpoints: mastodonRestGlobalMastodonInstanceHttpsFosstodonOrgEndpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: mastodonRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: mastodonRestCredentials,
			proxyId: '["Mastodon_Rest","Feed","mastodon-public-timeline:https://fosstodon.org","HttpProxy","RestJson"]',
			artifacts: mastodonRestArtifacts,
		},
	],
} as const satisfies SourceBindingIndex
