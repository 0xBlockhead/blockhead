/**
 * Neynar Farcaster request and response shapes.
 * @see https://docs.neynar.com/openapi/api/openapi.yaml
 */

import type {
	components,
	operations,
} from '$/sources/Neynar/OpenApi/openapi.d.ts'

type NeynarConversationParameters = operations['lookup-cast-conversation']['parameters']['query']
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
export type NeynarCastResponse = operations['lookup-cast-by-hash-or-url']['responses'][200]['content']['application/json']
export type NeynarConversationResponse = operations['lookup-cast-conversation']['responses'][200]['content']['application/json']
export type NeynarFeedResponse = operations['fetch-feed']['responses'][200]['content']['application/json']
export type NeynarBulkUsersResponse = operations['fetch-bulk-users']['responses'][200]['content']['application/json']

export type NeynarConversationQuery =
	| {
		identifier: `0x${string}`
		type: Extract<NeynarConversationParameters['type'], 'hash'>
	}
	| {
		identifier: string
		type: Extract<NeynarConversationParameters['type'], 'url'>
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
