import { describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const youtubeQueries = vi.hoisted(() => ({
	getChannel: vi.fn(),
	getComment: vi.fn(),
	listCompleteCommentReplies: vi.fn(),
	listChannelPlaylists: vi.fn(),
	listCommentThreads: vi.fn(),
	listPlaylistItems: vi.fn(),
	listPopularVideos: vi.fn(),
	searchChannelVideos: vi.fn(),
}))

const pipedQueries = vi.hoisted(() => ({
	getChannel: vi.fn(),
	getChannelIdFromUploaderUrl: vi.fn((url: string | undefined) => url?.split('/channel/')[1]),
	getPlaylistIdFromUrl: vi.fn((url: string | undefined) => url?.split('/playlist?list=')[1]),
	getVideoIdFromUrl: vi.fn((url: string | undefined) => url?.split('/watch?v=')[1]),
	listChannelPlaylists: vi.fn(),
	listChannelVideos: vi.fn(),
	listComments: vi.fn(),
	listTrending: vi.fn(),
}))

vi.mock('$/sources/Youtube/Rest/queries.ts', () => youtubeQueries)
vi.mock('$/sources/Piped/Rest/queries.ts', () => pipedQueries)

const {
	listChannelVideos,
	listPlaylistVideos,
} = await vi.importActual<typeof import('$/sources/Piped/Rest/queries.ts')>(
	'$/sources/Piped/Rest/queries.ts'
)
const { default: youtubeResolvers } = await import('$/resolvers/Youtube-Rest.ts')
const { default: pipedResolvers } = await import('$/resolvers/Piped-Rest.ts')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
	limit: 10,
}

describe('Piped preloaded page materialization', () => {
	it('preserves a preloaded playlist continuation', async () => {
		expect(await listPlaylistVideos(
			'playlist-1',
			10,
			{
				playlist: {
					nextpage: 'playlist-next',
					relatedStreams: [],
				},
			}
		)).toEqual({
			items: [],
			nextpage: 'playlist-next',
		})
	})

	it('marks preloaded stream suggestions terminal', async () => {
		expect(await listChannelVideos(
			'channel-1',
			10,
			{
				stream: {
					relatedStreams: [],
				},
			}
		)).toEqual({
			items: [],
			nextpage: undefined,
		})
	})
})

describe.each([
	{
		label: 'YouTube',
		continuationToken: 'youtube-next',
		resolveRows: async () => {
			const videoSnapshot = await youtubeResolvers.resolvers[4].resolve['ChannelId'].resolve(
				{ channelId: 'channel-1' },
				resolverContext
			)
			const playlistSnapshot = await youtubeResolvers.resolvers[5].resolve['ChannelId'].resolve(
				{ channelId: 'channel-1' },
				resolverContext
			)
			const commentSnapshot = await youtubeResolvers.resolvers[7].resolve['VideoId'].resolve(
				{ videoId: 'video-1' },
				resolverContext
			)
			return {
				video: youtubeResolvers.resolvers[4].projections.$$videos.select(
					videoSnapshot,
					{ channelId: 'channel-1' },
					resolverContext
				)[0],
				playlist: youtubeResolvers.resolvers[5].projections.$$playlists.select(
					playlistSnapshot,
					{ channelId: 'channel-1' },
					resolverContext
				)[0],
				comment: youtubeResolvers.resolvers[7].projections.$$comments.select(
					commentSnapshot,
					{ videoId: 'video-1' },
					resolverContext
				)[0],
				continuation: youtubeResolvers.resolvers[7].projections.$$comments.continuation(
					commentSnapshot,
					{ videoId: 'video-1' },
					resolverContext
				),
				channel: (
					youtubeResolvers.resolvers[10].projections.$$observedChannels(
						await youtubeResolvers.resolvers[10].resolve['Scope'].resolve(
						{ scope: '_GlobalYoutubeNetwork' },
						resolverContext
						)
					)
				)[0],
			}
		},
		arrange: () => {
			youtubeQueries.searchChannelVideos.mockResolvedValueOnce({
				items: [{
					id: { videoId: 'video-1' },
					snippet: {
						title: 'Useful video',
						description: 'Video description',
						publishedAt: '2026-01-02T03:04:05Z',
						channelId: 'channel-1',
						channelTitle: 'Useful channel',
						thumbnails: {
							high: { url: 'https://i.ytimg.com/video-1.jpg' },
						},
					},
				}],
			})
			youtubeQueries.listChannelPlaylists.mockResolvedValueOnce({
				items: [{
					id: 'playlist-1',
					snippet: {
						title: 'Useful playlist',
						channelId: 'channel-1',
						channelTitle: 'Useful channel',
						thumbnails: {
							high: { url: 'https://i.ytimg.com/playlist-1.jpg' },
						},
					},
				}],
			})
			youtubeQueries.listCommentThreads.mockResolvedValueOnce({
				nextPageToken: 'youtube-next',
				items: [{
					snippet: {
						topLevelComment: {
							id: 'comment-1',
							snippet: {
								authorDisplayName: 'Useful author',
								textDisplay: '<b>Useful comment</b>',
								textOriginal: 'Useful comment',
								publishedAt: '2026-01-02T03:04:05Z',
								authorChannelId: { value: 'channel-1' },
							},
						},
					},
				}],
			})
			youtubeQueries.listPopularVideos.mockResolvedValueOnce({
				items: [{
					id: 'video-1',
					snippet: {
						channelId: 'channel-1',
						channelTitle: 'Useful channel',
					},
				}],
			})
		},
	},
	{
		label: 'Piped',
		continuationToken: 'piped-next',
		resolveRows: async () => {
			const videoSnapshot = await pipedResolvers.resolvers[4].resolve['ChannelId'].resolve(
				{ channelId: 'channel-1' },
				resolverContext
			)
			const playlistSnapshot = await pipedResolvers.resolvers[5].resolve['ChannelId'].resolve(
				{ channelId: 'channel-1' },
				resolverContext
			)
			const commentSnapshot = await pipedResolvers.resolvers[7].resolve['VideoId'].resolve(
				{ videoId: 'video-1' },
				resolverContext
			)
			return {
				video: pipedResolvers.resolvers[4].projections.$$videos.select(
					videoSnapshot,
					{ channelId: 'channel-1' },
					resolverContext
				)[0],
				playlist: pipedResolvers.resolvers[5].projections.$$playlists.select(
					playlistSnapshot,
					{ channelId: 'channel-1' },
					resolverContext
				)[0],
				comment: pipedResolvers.resolvers[7].projections.$$comments.select(
					commentSnapshot,
					{ videoId: 'video-1' },
					resolverContext
				)[0],
				continuation: pipedResolvers.resolvers[7].projections.$$comments.continuation(
					commentSnapshot,
					{ videoId: 'video-1' },
					resolverContext
				),
				channel: (
					pipedResolvers.resolvers[8].projections.$$observedChannels(
						await pipedResolvers.resolvers[8].resolve['Scope'].resolve(
						{ scope: '_GlobalYoutubeNetwork' },
						resolverContext
						)
					)
				)[0],
			}
		},
		arrange: () => {
			pipedQueries.listChannelVideos.mockResolvedValueOnce({
				items: [{
					url: '/watch?v=video-1',
					title: 'Useful video',
					thumbnail: 'https://i.ytimg.com/video-1.jpg',
					uploaderName: 'Useful channel',
					uploaderUrl: '/channel/channel-1',
					uploadedDate: '2026-01-02T03:04:05Z',
				}],
			})
			pipedQueries.listChannelPlaylists.mockResolvedValueOnce({
				items: [{
					url: '/playlist?list=playlist-1',
					name: 'Useful playlist',
					thumbnail: 'https://i.ytimg.com/playlist-1.jpg',
					uploaderName: 'Useful channel',
					uploaderUrl: '/channel/channel-1',
				}],
			})
			pipedQueries.listComments.mockResolvedValueOnce({
				nextpage: 'piped-next',
				comments: [{
					commentId: 'comment-1',
					author: 'Useful author',
					commentText: 'Useful comment',
					commentedTime: '2026-01-02T03:04:05Z',
					commentorUrl: '/channel/channel-1',
				}],
			})
			pipedQueries.listTrending.mockResolvedValueOnce([{
				url: '/watch?v=video-1',
				uploaderName: 'Useful channel',
				uploaderUrl: '/channel/channel-1',
			}])
		},
	},
])('$label parent list materialization', ({
	continuationToken,
	resolveRows,
	arrange,
}) => {
	it('prefills useful channel, video, playlist, and comment cards', async () => {
		arrange()

		const {
			video,
			playlist,
			comment,
			continuation,
			channel,
		} = await resolveRows()
		expect(continuation).toEqual({
			operation: continuationToken === 'youtube-next' ? 'commentThreads.list' : 'comments',
			target: 'video-1',
			terminal: false,
			token: continuationToken,
		})

		expect(video[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'title')]: 'Useful video',
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], 'thumbnailUrl')]: 'https://i.ytimg.com/video-1.jpg',
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], '$thumbnail')]: {
				[EntityMetaKey.Selector]: {
					url: 'https://i.ytimg.com/video-1.jpg',
				},
			},
			[entityFieldAddressKey(EntityType.YoutubeVideo, [], '$author')]: {
				[EntityMetaKey.Selector]: { channelId: 'channel-1' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.YoutubeChannel, [], 'title')]: 'Useful channel',
				},
			},
		})
		expect(playlist[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], 'title')]: 'Useful playlist',
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], '$thumbnail')]: {
				[EntityMetaKey.Selector]: {
					url: 'https://i.ytimg.com/playlist-1.jpg',
				},
			},
			[entityFieldAddressKey(EntityType.YoutubePlaylist, [], '$channel')]: {
				[EntityMetaKey.Selector]: { channelId: 'channel-1' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.YoutubeChannel, [], 'title')]: 'Useful channel',
				},
			},
		})
		expect(comment[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'text')]: 'Useful comment',
			[entityFieldAddressKey(EntityType.YoutubeComment, [], 'authorDisplayName')]: 'Useful author',
		})
		expect(channel[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.YoutubeChannel, [], 'title')]: 'Useful channel',
		})
		for (const request of (
			continuationToken === 'youtube-next' ?
				[
					youtubeQueries.searchChannelVideos,
					youtubeQueries.listChannelPlaylists,
					youtubeQueries.listCommentThreads,
					youtubeQueries.listPopularVideos,
				]
			:
				[
					pipedQueries.listChannelVideos,
					pipedQueries.listChannelPlaylists,
					pipedQueries.listComments,
					pipedQueries.listTrending,
				]
		))
			expect(request).toHaveBeenCalledTimes(1)
	})
})

describe('YouTube observation provenance', () => {
	it('requests observed playlists only for channels returned by the live source snapshot', async () => {
		youtubeQueries.listPopularVideos.mockClear()
		youtubeQueries.listChannelPlaylists.mockClear()
		youtubeQueries.listPopularVideos.mockResolvedValueOnce({
			items: [
				{
					snippet: {
						channelId: 'live-channel',
					},
				},
				{
					snippet: {
						channelId: 'live-channel',
					},
				},
			],
		})
		youtubeQueries.listChannelPlaylists.mockResolvedValueOnce({
			items: [{
				id: 'live-playlist',
				snippet: {
					channelId: 'live-channel',
					title: 'Live playlist',
				},
			}],
		})

		const playlists = await youtubeResolvers.resolvers[11]
			.resolve['Scope']
			.resolve(
				{ scope: '_GlobalYoutubeNetwork' },
				resolverContext
			)

		expect(youtubeQueries.listPopularVideos).toHaveBeenCalledOnce()
		expect(youtubeQueries.listChannelPlaylists).toHaveBeenCalledOnce()
		expect(youtubeQueries.listChannelPlaylists).toHaveBeenCalledWith(
			resolverContext.publicEnv,
			'live-channel',
			64
		)
		expect(playlists).toHaveLength(1)
		expect(playlists[0][EntityMetaKey.Selector]).toEqual({
			playlistId: 'live-playlist',
		})
	})

	it.each([
		{
			label: 'YouTube',
			source: Source.Youtube_Rest,
			request: youtubeQueries.getChannel,
			resolveObservation: async () => {
				const channel = await youtubeResolvers.resolvers[0].resolve['ChannelId'].resolve(
					{ channelId: 'channel-1' },
					resolverContext
				)
				return youtubeResolvers.resolvers[0].projections.$$timestamps(channel)[0]
			},
			historicalResolverEntityTypes: youtubeResolvers.resolvers.map(({ entityType }) => entityType),
			arrange: () => youtubeQueries.getChannel.mockResolvedValueOnce({
				items: [{
					statistics: {
						subscriberCount: '0',
						videoCount: '0',
						viewCount: '0',
					},
				}],
			}),
		},
		{
			label: 'Piped',
			source: Source.Piped_Rest,
			request: pipedQueries.getChannel,
			resolveObservation: async () => {
				const channel = await pipedResolvers.resolvers[0].resolve['ChannelId'].resolve(
					{ channelId: 'channel-1' },
					resolverContext
				)
				return pipedResolvers.resolvers[0].projections.$$timestamps(channel)[0]
			},
			historicalResolverEntityTypes: pipedResolvers.resolvers.map(({ entityType }) => entityType),
			arrange: () => pipedQueries.getChannel.mockResolvedValueOnce({
				id: 'channel-1',
				subscriberCount: 0,
			}),
		},
	])('$label captures source-keyed persisted observations without historical refetch resolvers', async ({
		source,
		request,
		resolveObservation,
		historicalResolverEntityTypes,
		arrange,
	}) => {
		arrange()
		const observation = await resolveObservation()

		expect(request).toHaveBeenCalledOnce()
		expect(observation[EntityMetaKey.Selector]).toMatchObject({
			$channel: { channelId: 'channel-1' },
			source,
		})
		for (const entityType of [
			EntityType.YoutubeChannel_Timestamp,
			EntityType.YoutubeComment_Timestamp,
			EntityType.YoutubePlaylist_Timestamp,
			EntityType.YoutubeVideo_Timestamp,
		])
			expect(historicalResolverEntityTypes).not.toContain(entityType)
	})
})

describe('YouTube reading-card continuation and identity', () => {
	it.each([
		{
			resolverIndex: 4,
			projection: '$$videos' as const,
			operation: 'search.list:channel-videos',
			target: { channelId: 'channel-1' },
			request: youtubeQueries.searchChannelVideos,
		},
		{
			resolverIndex: 5,
			projection: '$$playlists' as const,
			operation: 'playlists.list:channel',
			target: { channelId: 'channel-1' },
			request: youtubeQueries.listChannelPlaylists,
		},
		{
			resolverIndex: 6,
			projection: '$$videos' as const,
			operation: 'playlistItems.list',
			target: { playlistId: 'playlist-1' },
			request: youtubeQueries.listPlaylistItems,
		},
	])('carries opaque provider tokens through $operation', async ({
		resolverIndex,
		projection,
		operation,
		target,
		request,
	}) => {
		request.mockResolvedValueOnce({
			items: [],
			nextPageToken: 'opaque/+ % token',
		})
		const resolver = youtubeResolvers.resolvers[resolverIndex]
		const page = await resolver.resolve[Object.keys(resolver.resolve)[0]].resolve(
			target,
			{
				...resolverContext,
				providerContinuationToken: 'previous opaque token',
			}
		)

		expect(request).toHaveBeenLastCalledWith(
			resolverContext.publicEnv,
			Object.values(target)[0],
			64,
			'previous opaque token'
		)
		expect(resolver.projections[projection].continuation(
			page,
			target,
			resolverContext
		)).toEqual({
			operation,
			target: Object.values(target)[0],
			terminal: false,
			token: 'opaque/+ % token',
		})
	})

	it('rejects a comment detail returned for another video subject', async () => {
		youtubeQueries.getComment.mockResolvedValueOnce({
			items: [{
				id: 'comment-1',
				snippet: {
					videoId: 'video-2',
					textOriginal: 'Wrong subject',
				},
			}],
		})

		await expect(
			youtubeResolvers.resolvers[3].resolve.VideoIdCommentId.resolve(
				{
					videoId: 'video-1',
					commentId: 'comment-1',
				},
				resolverContext
			)
		).rejects.toThrow('comment does not belong to requested video')
	})

	it('materializes completed official replies with exact video, parent, author, order, and continuation', async () => {
		youtubeQueries.getComment.mockResolvedValueOnce({
			items: [{
				id: 'parent-1',
				snippet: {
					videoId: 'video-1',
				},
			}],
		})
		youtubeQueries.listCompleteCommentReplies.mockResolvedValueOnce({
			items: [
				{
					id: 'reply-1',
					snippet: {
						videoId: 'video-1',
						parentId: 'parent-1',
						authorChannelId: { value: 'channel-1' },
						authorProfileImageUrl: 'https://yt3.ggpht.com/channel-1=s48',
						textOriginal: 'First reply',
						publishedAt: '2026-01-02T03:04:05Z',
					},
				},
				{
					id: 'reply-2',
					snippet: {
						videoId: 'video-1',
						parentId: 'parent-1',
						authorChannelId: { value: 'channel-2' },
						textOriginal: 'Second reply',
						publishedAt: '2026-01-03T03:04:05Z',
					},
				},
			],
			nextPageToken: 'opaque/+ % token',
		})
		const resolver = youtubeResolvers.resolvers[9]
		const selector = {
			videoId: 'video-1',
			commentId: 'parent-1',
		}
		const page = await resolver.resolve.VideoIdCommentId.resolve(
			selector,
			resolverContext
		)

		expect(youtubeQueries.listCompleteCommentReplies).toHaveBeenCalledWith(
			resolverContext.publicEnv,
			'video-1',
			'parent-1',
			64,
			undefined
		)
		expect(resolver.projections.$$replies.select(
			page,
			selector,
			resolverContext
		)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					videoId: 'video-1',
					commentId: 'reply-1',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.YoutubeComment, [], 'text')]: 'First reply',
					[entityFieldAddressKey(EntityType.YoutubeComment, [], '$author')]: {
						[EntityMetaKey.Selector]: { channelId: 'channel-1' },
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.YoutubeChannel, [], '$icon')]: {
								[EntityMetaKey.Selector]: {
									url: 'https://yt3.ggpht.com/channel-1=s48',
								},
							},
						},
					},
					[entityFieldAddressKey(EntityType.YoutubeComment, [], '$video')]: {
						[EntityMetaKey.Selector]: { videoId: 'video-1' },
					},
					[entityFieldAddressKey(EntityType.YoutubeComment, [], '$parentComment')]: {
						[EntityMetaKey.Selector]: {
							videoId: 'video-1',
							commentId: 'parent-1',
						},
					},
				},
			},
			{
				[EntityMetaKey.Selector]: {
					videoId: 'video-1',
					commentId: 'reply-2',
				},
			},
		])
		expect(resolver.projections.$$replies.continuation(
			page,
			selector,
			resolverContext
		)).toEqual({
			operation: 'comments.list:replies',
			target: 'parent-1',
			terminal: false,
			token: 'opaque/+ % token',
		})
	})
})
