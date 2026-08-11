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
