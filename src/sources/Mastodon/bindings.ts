// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

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

const bindings = [
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
		artifacts: mastodonRestArtifacts,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Mastodon_Rest]: readonly [typeof bindings[0], typeof bindings[1], typeof bindings[2]] }>(bindings)
