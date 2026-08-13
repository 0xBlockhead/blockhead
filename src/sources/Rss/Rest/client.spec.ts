import { beforeEach, expect, test, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Rss/bindings.ts'

const hnrssBinding = bindings[Source.Rss_Rest].find((binding) => binding.target.key === 'https://hnrss.org')
if (hnrssBinding == null)
	throw new Error('Rss_Rest test binding is missing')

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

import { rssFetchFeed } from '$/sources/Rss/Rest/client.ts'

beforeEach(() => {
	sourceFetch.mockReset()
})

test('uses the feed-target HttpProxy binding and parses its response', async () => {
	sourceFetch.mockResolvedValueOnce(new Response(`
		<rss>
			<channel>
				<title>Fixture feed</title>
				<item>
					<title>Fixture item</title>
					<guid>fixture-item</guid>
				</item>
			</channel>
		</rss>
	`))

	await expect(rssFetchFeed(hnrssBinding, 'https://hnrss.org/frontpage')).resolves.toMatchObject({
		title: 'Fixture feed',
		items: [
			{
				title: 'Fixture item',
				guid: 'fixture-item',
			},
		],
	})
	expect(sourceFetch).toHaveBeenCalledWith(
		expect.objectContaining({
			source: Source.Rss_Rest,
			target: {
				kind: SourceTargetKind.Feed,
				key: 'https://hnrss.org',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://hnrss.org',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
			delivery: SourceDelivery.HttpProxy,
			credentials: [],
		}),
		'https://hnrss.org/frontpage'
	)
})

test('preserves a registered feed URL path, query, and reserved values', async () => {
	sourceFetch.mockResolvedValueOnce(new Response('<rss><channel /></rss>'))

	await rssFetchFeed(
		hnrssBinding,
		' https://hnrss.org/frontpage?target=https%3A%2F%2Fexample.com%2Fa%3Fx%3D1%26y%3D2&label=a%2Bb%23c '
	)

	expect(sourceFetch).toHaveBeenCalledWith(
		expect.any(Object),
		'https://hnrss.org/frontpage?target=https%3A%2F%2Fexample.com%2Fa%3Fx%3D1%26y%3D2&label=a%2Bb%23c'
	)
})

test('materializes native enclosure URLs across RSS, Atom, Media RSS, and Podcasting 2.0', async () => {
	for (const [enclosureMarkup, enclosureUrl] of [
		[
			'<enclosure length="12" type="audio/mpeg" url="https://media.example/rss.mp3" />',
			'https://media.example/rss.mp3',
		],
		[
			'<link type="audio/mpeg" href="https://media.example/atom.mp3" rel="enclosure" />',
			'https://media.example/atom.mp3',
		],
		[
			'<media:content medium="audio" url="https://media.example/media-rss.mp3" />',
			'https://media.example/media-rss.mp3',
		],
		[
			'<podcast:alternateEnclosure type="audio/mpeg"><podcast:source uri="https://media.example/podcast.mp3" /></podcast:alternateEnclosure>',
			'https://media.example/podcast.mp3',
		],
	] as const) {
		sourceFetch.mockResolvedValueOnce(new Response(`
			<rss>
				<channel>
					<item>
						<guid>fixture-item</guid>
						${enclosureMarkup}
					</item>
				</channel>
			</rss>
		`))

		await expect(rssFetchFeed(hnrssBinding, 'https://hnrss.org/frontpage')).resolves.toMatchObject({
			items: [{
				enclosureUrl,
			}],
		})
	}
})

test('withholds credentialed and non-HTTP feed metadata URLs from visible fields', async () => {
	sourceFetch.mockResolvedValueOnce(new Response(`
		<rss>
			<channel>
				<link>https://reader:token@example.com/site</link>
				<image><url>data:image/png;base64,secret</url></image>
				<item>
					<guid>fixture-item</guid>
					<link>https://example.com/article?edition=weekly</link>
					<enclosure url="https://reader:token@example.com/podcast.mp3" />
					<comments>javascript:alert(1)</comments>
				</item>
			</channel>
		</rss>
	`))

	const feed = await rssFetchFeed(hnrssBinding, 'https://hnrss.org/frontpage')

	expect(feed).toMatchObject({
		items: [{
			guid: 'fixture-item',
			link: 'https://example.com/article?edition=weekly',
		}],
	})
	expect(feed.siteUrl).toBeUndefined()
	expect(feed.imageUrl).toBeUndefined()
	expect(feed.items[0]?.enclosureUrl).toBeUndefined()
	expect(feed.items[0]?.commentsUrl).toBeUndefined()
})

test('rejects credentials in a same-origin feed URL before transport', async () => {
	await expect(rssFetchFeed(
		hnrssBinding,
		'https://reader:secret@hnrss.org/frontpage'
	)).rejects.toThrow('feed URL must not contain credentials')

	expect(sourceFetch).not.toHaveBeenCalled()
})

test('rejects repeated canonical item identities from the scoped feed response', async () => {
	sourceFetch.mockResolvedValueOnce(new Response(`
		<rss>
			<channel>
				<item><guid>same-item</guid></item>
				<item><guid>same-item</guid></item>
			</channel>
		</rss>
	`))

	await expect(rssFetchFeed(hnrssBinding, 'https://hnrss.org/frontpage')).rejects.toThrow(
		'duplicate item identity'
	)
	expect(sourceFetch).toHaveBeenCalledOnce()
})

test('rejects failed refresh responses before parsing their bodies', async () => {
	sourceFetch.mockResolvedValueOnce(new Response('<rss><channel /></rss>', {
		status: 503,
		statusText: 'Service Unavailable',
	}))

	await expect(rssFetchFeed(hnrssBinding, 'https://hnrss.org/frontpage')).rejects.toThrow(
		'503 Service Unavailable'
	)
})

test('rejects a non-feed XML response instead of reporting a reachable empty feed', async () => {
	sourceFetch.mockResolvedValueOnce(new Response('<html><body>temporarily unavailable</body></html>'))

	await expect(rssFetchFeed(hnrssBinding, 'https://hnrss.org/frontpage')).rejects.toThrow(
		'invalid feed XML envelope'
	)
})
