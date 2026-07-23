import { beforeEach, expect, test, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	SourceDelivery,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

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

	await expect(rssFetchFeed('https://hnrss.org/frontpage')).resolves.toMatchObject({
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
			delivery: SourceDelivery.HttpProxy,
		}),
		'https://hnrss.org/frontpage'
	)
})

test('rejects feeds without a registered target binding', async () => {
	await expect(rssFetchFeed('https://example.com/feed.xml')).rejects.toThrow(
		'Rss_Rest: source binding is missing for https://example.com'
	)
	expect(sourceFetch).not.toHaveBeenCalled()
})

test('rejects failed refresh responses before parsing their bodies', async () => {
	sourceFetch.mockResolvedValueOnce(new Response('<rss><channel /></rss>', {
		status: 503,
		statusText: 'Service Unavailable',
	}))

	await expect(rssFetchFeed('https://hnrss.org/frontpage')).rejects.toThrow(
		'503 Service Unavailable'
	)
})
