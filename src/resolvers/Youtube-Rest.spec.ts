import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const listPopularVideos = vi.hoisted(() => vi.fn())
const getChannel = vi.hoisted(() => vi.fn())
const getVideo = vi.hoisted(() => vi.fn())
const getPlaylist = vi.hoisted(() => vi.fn())
const getComment = vi.hoisted(() => vi.fn())
const getCommentThread = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Youtube/Rest/queries.ts', async (importOriginal) => {
	const original = await importOriginal<typeof import('$/sources/Youtube/Rest/queries.ts')>()
	return {
		...original,
		getChannel,
		getVideo,
		getPlaylist,
		getComment,
		getCommentThread,
		listPopularVideos,
	}
})

const { default: youtubeRest } = await import('$/resolvers/Youtube-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
		offset: 0,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_YOUTUBE_API_KEY: 'test-key',
	},
}

const resolver = (
	entityType: EntityType,
	projection?: string
) => {
	const match = youtubeRest.resolvers.find((entry) => (
		entry.entityType === entityType
		&& (
			projection == null
			|| projection in entry.projections
		)
	))
	if (match == null)
		throw new Error(`missing Youtube resolver for ${entityType}${projection == null ? '' : ` ${projection}`}`)
	return match
}

beforeEach(() => {
	vi.restoreAllMocks()
	getVideo.mockReset()
	getChannel.mockReset()
	getPlaylist.mockReset()
	getComment.mockReset()
	getCommentThread.mockReset()
	listPopularVideos.mockReset()
})

describe('Youtube Rest enrolled leftovers', () => {
	it('projects hub tip observed counts from popular videos', async () => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_200)
		listPopularVideos.mockImplementationOnce(async () => {
			expect(dateNow).not.toHaveBeenCalled()
			return {
				items: [
					{
						id: 'v1',
						snippet: {
							channelId: 'UCa',
						},
					},
					{
						id: 'v2',
						snippet: {
							channelId: 'UCa',
						},
					},
					{
						id: 'v3',
						snippet: {
							channelId: 'UCb',
						},
					},
				],
			}
		})

		const observations = await resolver(
			EntityType._GlobalYoutubeNetwork,
			'$$timestamps'
		).resolve.Scope.resolve({
			scope: '_GlobalYoutubeNetwork',
		}, context)

		expect(observations).toEqual([{
			[EntityMetaKey.Selector]: {
				$hub: { scope: '_GlobalYoutubeNetwork' },
				timestampMs: 1_700_000_000_200,
				source: Source.Youtube_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'observedChannelCount')]: 2,
				[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'observedVideoCount')]: 3,
				[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'reachable')]: true,
			},
		}])
		expect(dateNow).toHaveBeenCalledOnce()
	})

	it('timestamps unreachable observations after the failed request completes', async () => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_201)
		listPopularVideos.mockImplementationOnce(async () => {
			expect(dateNow).not.toHaveBeenCalled()
			throw new Error('Youtube unavailable')
		})

		const observations = await resolver(
			EntityType._GlobalYoutubeNetwork,
			'$$timestamps'
		).resolve.Scope.resolve({
			scope: '_GlobalYoutubeNetwork',
		}, context)

		expect(observations[0]?.[EntityMetaKey.Selector].timestampMs).toBe(1_700_000_000_201)
		expect(observations[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'reachable')]: false,
		})
	})

	it('does not register a direct global observation resolver', () => {
		expect(youtubeRest.resolvers.some((candidate) => (
			candidate.entityType === EntityType._GlobalYoutubeNetwork_Timestamp
		))).toBe(false)
	})

	it('writes every REST observation with its exact selector and local refresh clock', async () => {
		const timestampMs = 1_700_000_000_202
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(timestampMs)
		const assertLocalRefreshObservation = (
			observation: { [EntityMetaKey.Selector]: Record<string, unknown> },
			selector: Record<string, unknown>
		) => {
			expect(observation[EntityMetaKey.Selector]).toEqual({
				...selector,
				timestampMs,
				source: Source.Youtube_Rest,
			})
		}

		getChannel.mockImplementationOnce(async () => {
			expect(dateNow).not.toHaveBeenCalled()
			return { items: [{ statistics: {} }] }
		})
		const channel = await resolver(EntityType.YoutubeChannel).resolve.ChannelId.resolve({ channelId: 'channel-1' }, context)
		assertLocalRefreshObservation(channel.$$timestamps[0], { $channel: { channelId: 'channel-1' } })

		getVideo.mockImplementationOnce(async () => {
			expect(dateNow).toHaveBeenCalledOnce()
			return { items: [{ contentDetails: {}, statistics: {} }] }
		})
		const video = await resolver(EntityType.YoutubeVideo).resolve.VideoId.resolve({ videoId: 'video-1' }, context)
		assertLocalRefreshObservation(video.$$timestamps[0], { $video: { videoId: 'video-1' } })

		getPlaylist.mockImplementationOnce(async () => {
			expect(dateNow).toHaveBeenCalledTimes(2)
			return { items: [{ contentDetails: {} }] }
		})
		const playlist = await resolver(EntityType.YoutubePlaylist).resolve.PlaylistId.resolve({ playlistId: 'playlist-1' }, context)
		assertLocalRefreshObservation(playlist.$$timestamps[0], { $playlist: { playlistId: 'playlist-1' } })

		getComment.mockImplementationOnce(async () => {
			expect(dateNow).toHaveBeenCalledTimes(3)
			return { items: [{ snippet: { videoId: 'video-1' } }] }
		})
		getCommentThread.mockResolvedValueOnce({ items: [] })
		const comment = await resolver(EntityType.YoutubeComment, '$$timestamps').resolve.VideoIdCommentId.resolve({
			videoId: 'video-1',
			commentId: 'comment-1',
		}, context)
		assertLocalRefreshObservation(comment.$$timestamps[0], {
			$comment: { videoId: 'video-1', commentId: 'comment-1' },
		})
		expect(dateNow).toHaveBeenCalledTimes(4)
	})

	it('preserves complete ISO 8601 duration precision from video content metadata', async () => {
		getVideo.mockResolvedValueOnce({
			items: [{
				id: 'duration-video',
				contentDetails: {
					duration: 'P1DT2H3M4.5S',
				},
			}],
		})

		const video = await resolver(EntityType.YoutubeVideo).resolve.VideoId.resolve({
			videoId: 'duration-video',
		}, context)

		expect(video.durationSeconds).toBe(93_784.5)
	})
})
