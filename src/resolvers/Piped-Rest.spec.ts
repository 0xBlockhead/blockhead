import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { YoutubeLiveBroadcastContent } from '$/schema/YoutubeLiveBroadcastContent.ts'
import { Source } from '$/sources/Source.ts'

const getStream = vi.hoisted(() => vi.fn())
const listTrending = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Piped/Rest/queries.ts', async (importOriginal) => {
	const original = await importOriginal<typeof import('$/sources/Piped/Rest/queries.ts')>()
	return {
		...original,
		getStream,
		listTrending,
	}
})

const { default: pipedRest } = await import('$/resolvers/Piped-Rest.ts')

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
	publicEnv: {},
}

const resolver = (
	entityType: EntityType,
	projection?: string
) => {
	const match = pipedRest.resolvers.find((entry) => (
		entry.entityType === entityType
		&& (
			projection == null
			|| projection in entry.projections
		)
	))
	if (match == null)
		throw new Error(`missing Piped resolver for ${entityType}${projection == null ? '' : ` ${projection}`}`)
	return match
}

beforeEach(() => {
	getStream.mockReset()
	listTrending.mockReset()
})

describe('Piped Rest enrolled leftovers', () => {
	it('projects video tip view/like counts and liveBroadcastContent', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_000)
		getStream.mockResolvedValueOnce({
			title: 'Demo',
			views: 42,
			likes: 7,
			livestream: true,
			uploaderUrl: '/channel/UCdemo',
		})

		const video = await resolver(
			EntityType.YoutubeVideo,
			'$$timestamps'
		).resolve.VideoId.resolve({
			videoId: 'abc',
		}, context)

		expect(video.liveBroadcastContent).toBe(YoutubeLiveBroadcastContent.Live)
		expect(video.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$video: { videoId: 'abc' },
				timestampMs: 1_700_000_000_000,
				source: Source.Piped_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.YoutubeVideo_Timestamp, [], 'viewCount')]: 42,
				[entityFieldAddressKey(EntityType.YoutubeVideo_Timestamp, [], 'likeCount')]: 7,
			},
		}])
	})

	it('projects hub tip observed counts from the trending window', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_100)
		listTrending.mockResolvedValueOnce([
			{
				url: '/watch?v=v1',
				uploaderUrl: '/channel/UCa',
			},
			{
				url: '/watch?v=v2',
				uploaderUrl: '/channel/UCa',
			},
			{
				url: '/watch?v=v3',
				uploaderUrl: '/channel/UCb',
			},
		])

		const observations = await resolver(
			EntityType._GlobalYoutubeNetwork,
			'$$timestamps'
		).resolve.Scope.resolve({
			scope: '_GlobalYoutubeNetwork',
		}, context)

		expect(observations).toEqual([{
			[EntityMetaKey.Selector]: {
				$hub: { scope: '_GlobalYoutubeNetwork' },
				timestampMs: 1_700_000_000_100,
				source: Source.Piped_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'observedChannelCount')]: 2,
				[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'observedVideoCount')]: 3,
				[entityFieldAddressKey(EntityType._GlobalYoutubeNetwork_Timestamp, [], 'reachable')]: true,
			},
		}])
	})

	it('reuses persisted hub observations without refetching', async () => {
		const observation = resolver(EntityType._GlobalYoutubeNetwork_Timestamp)

		await expect(observation.resolve.HubTimestampMsSource.resolve({
			$hub: {
				scope: '_GlobalYoutubeNetwork',
			},
			timestampMs: 1_700_000_000_100,
			source: Source.Piped_Rest,
		}, context)).resolves.toEqual({
			$hub: {
				[EntityMetaKey.Selector]: {
					scope: '_GlobalYoutubeNetwork',
				},
			},
			timestampMs: 1_700_000_000_100,
			source: Source.Piped_Rest,
		})
		expect(listTrending).not.toHaveBeenCalled()
		await expect(observation.resolve.HubTimestampMsSource.resolve({
			$hub: {
				scope: '_GlobalYoutubeNetwork',
			},
			timestampMs: 1_700_000_000_100,
			source: Source.Youtube_Rest,
		}, context)).rejects.toThrow('source mismatch')
	})
})
