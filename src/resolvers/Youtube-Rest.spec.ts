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

vi.mock('$/sources/Youtube/Rest/queries.ts', async (importOriginal) => {
	const original = await importOriginal<typeof import('$/sources/Youtube/Rest/queries.ts')>()
	return {
		...original,
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
	listPopularVideos.mockReset()
})

describe('Youtube Rest enrolled leftovers', () => {
	it('projects hub tip observed counts from popular videos', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_200)
		listPopularVideos.mockResolvedValueOnce({
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
	})

	it('does not register a direct global observation resolver', () => {
		expect(youtubeRest.resolvers.some((candidate) => (
			candidate.entityType === EntityType._GlobalYoutubeNetwork_Timestamp
		))).toBe(false)
	})
})
