/**
 * Neynar Farcaster request and response shapes.
 * @see https://docs.neynar.com/openapi/api/openapi.yaml
 */

import type {
	components,
	operations,
} from '$/sources/Neynar/OpenApi/openapi.d.ts'

type NeynarCastParameters = operations['lookup-cast-by-hash-or-url']['parameters']['query']
type NeynarChannelLookupParameters = operations['lookup-channel']['parameters']['query']
type NeynarChannelMembersParameters = operations['fetch-channel-members']['parameters']['query']
type NeynarFeedParameters = NonNullable<operations['fetch-feed']['parameters']['query']>
type NeynarFeedType = NonNullable<NeynarFeedParameters['feed_type']>
type NeynarFeedFilterType = NonNullable<NeynarFeedParameters['filter_type']>
type NeynarFeedPageQuery = {
	limit?: NeynarFeedParameters['limit']
	cursor?: NeynarFeedParameters['cursor']
	viewerFid?: NeynarFeedParameters['viewer_fid']
}

export type NeynarUser = components['schemas']['User']
export type NeynarCast = components['schemas']['Cast']
export type NeynarChannel = components['schemas']['Channel']
export type NeynarChannelMember = components['schemas']['ChannelMember']
export type NeynarCastResponse = operations['lookup-cast-by-hash-or-url']['responses'][200]['content']['application/json']
export type NeynarChannelResponse = operations['lookup-channel']['responses'][200]['content']['application/json']
export type NeynarChannelMembersResponse = operations['fetch-channel-members']['responses'][200]['content']['application/json']
export type NeynarConversationResponse = operations['lookup-cast-conversation']['responses'][200]['content']['application/json']
export type NeynarFeedResponse = operations['fetch-feed']['responses'][200]['content']['application/json']
export type NeynarBulkUsersResponse = operations['fetch-bulk-users']['responses'][200]['content']['application/json']
export type NeynarUserChannelsQuery = operations['fetch-user-channels']['parameters']['query']
export type NeynarUserChannelsResponse = operations['fetch-user-channels']['responses'][200]['content']['application/json']
export type NeynarUserChannelMembershipsQuery = operations['fetch-user-channel-memberships']['parameters']['query']
export type NeynarUserChannelMembershipsResponse = operations['fetch-user-channel-memberships']['responses'][200]['content']['application/json']

export type NeynarChannelLookupQuery = {
	id: NeynarChannelLookupParameters['id']
	type: NonNullable<NeynarChannelLookupParameters['type']>
	viewerFid?: NeynarChannelLookupParameters['viewer_fid']
}

export type NeynarChannelMembersQuery = {
	channelId: NeynarChannelMembersParameters['channel_id']
	fid?: NeynarChannelMembersParameters['fid']
	limit?: NeynarChannelMembersParameters['limit']
	cursor?: NeynarChannelMembersParameters['cursor']
}

export type NeynarCastQuery =
	| {
		identifier: `0x${string}`
		type: Extract<NeynarCastParameters['type'], 'hash'>
	}
	| {
		identifier: string
		type: Extract<NeynarCastParameters['type'], 'url'>
	}

export type NeynarFeedQuery = (
	& NeynarFeedPageQuery
	& (
		| {
			feedType: Extract<NeynarFeedType, 'filter'>
			filterType: Extract<NeynarFeedFilterType, 'global_trending'>
		}
		| {
			feedType: Extract<NeynarFeedType, 'filter'>
			filterType: Extract<NeynarFeedFilterType, 'fids'>
			fids: number[]
		}
		| {
			feedType: Extract<NeynarFeedType, 'filter'>
			filterType: Extract<NeynarFeedFilterType, 'channel_id'>
			channelId: NonNullable<NeynarFeedParameters['channel_id']>
			membersOnly?: NeynarFeedParameters['members_only']
		}
		| {
			feedType: Extract<NeynarFeedType, 'following'>
			fid: NonNullable<NeynarFeedParameters['fid']>
		}
	)
)
