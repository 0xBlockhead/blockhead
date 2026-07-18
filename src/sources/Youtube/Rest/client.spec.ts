import { beforeEach, expect, it, vi } from 'vitest'
import { SourceDelivery } from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({ sourceGetJson }))

const {
	listChannelPlaylists,
	listCommentReplies,
	searchChannels,
} = await import('$/sources/Youtube/Rest/queries.ts')

beforeEach(() => {
	sourceGetJson.mockReset()
	sourceGetJson.mockResolvedValue({ items: [] })
})

it('uses generated HttpProxy binding metadata and preserves reserved query identities', async () => {
	await searchChannels({
		PUBLIC_YOUTUBE_API_KEY: 'api key/+',
	}, 'channel / + % identity', 25)

	expect(sourceGetJson).toHaveBeenCalledTimes(1)
	expect(sourceGetJson.mock.calls[0][0]).toMatchObject({
		source: 'Youtube_Rest',
		delivery: SourceDelivery.HttpProxy,
		proxyId: 'Youtube_Rest-416',
		endpoints: [{
			locator: 'https://www.googleapis.com',
			origin: 'https://www.googleapis.com',
			corsEnabled: false,
		}],
	})
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('key')).toBe('api key/+')
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('q')).toBe('channel / + % identity')
})

it('keeps the YouTube binding endpoint registered as non-CORS provider reality', async () => {
	await searchChannels({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'channel', 1)

	expect(sourceGetJson.mock.calls[0][0].endpoints).toEqual([{
		endpointKind: 'HttpUrl',
		locator: 'https://www.googleapis.com',
		origin: 'https://www.googleapis.com',
		corsEnabled: false,
	}])
})

it('clamps bounded collection windows and fails closed without provider authentication', async () => {
	await listChannelPlaylists({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'channel', 500)
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('maxResults')).toBe('50')

	await expect(listChannelPlaylists({}, 'channel', 10)).rejects.toThrow(
		'Missing or empty required env: PUBLIC_YOUTUBE_API_KEY'
	)
})

it('passes provider continuation tokens only when explicitly supplied', async () => {
	await listCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'parent', 0)
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.get('maxResults')).toBe('1')
	expect(new URL(sourceGetJson.mock.calls[0][1]).searchParams.has('pageToken')).toBe(false)

	await listCommentReplies({
		PUBLIC_YOUTUBE_API_KEY: 'key',
	}, 'parent', 10, 'opaque/+ % token')
	expect(new URL(sourceGetJson.mock.calls[1][1]).searchParams.get('pageToken')).toBe('opaque/+ % token')
})
