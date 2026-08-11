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
import bindings from '$/sources/Rss2Json/bindings.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

import { rss2JsonGet } from '$/sources/Rss2Json/Rest/client.ts'
import { getFeed } from '$/sources/Rss2Json/Rest/queries.ts'

beforeEach(() => {
	sourceGetJson.mockReset()
})

test('uses the registered HttpProxy binding', async () => {
	sourceGetJson.mockResolvedValueOnce({
		status: 'ok',
	})

	await expect(rss2JsonGet(
		bindings[Source.Rss2Json_Rest][0],
		'/v1/api.json?rss_url=fixture'
	)).resolves.toEqual({
		status: 'ok',
	})
	expect(sourceGetJson).toHaveBeenCalledWith(
		expect.objectContaining({
			source: Source.Rss2Json_Rest,
			target: {
				kind: SourceTargetKind.Global,
				key: 'rss2json',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.rss2json.com',
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
		'https://api.rss2json.com/v1/api.json?rss_url=fixture'
	)
})

test('encodes an arbitrary feed URL as one reserved query value', async () => {
	sourceGetJson.mockResolvedValueOnce({
		status: 'ok',
		items: [],
	})

	await getFeed(
		'https://example.com/feed.xml?topic=a+b&redirect=https%3A%2F%2Fother.example%2Fx%3Fy%3D1%26z%3D2#latest'
	)

	const requestUrl = new URL(sourceGetJson.mock.calls[0][1])
	expect(requestUrl.origin).toBe('https://api.rss2json.com')
	expect(requestUrl.pathname).toBe('/v1/api.json')
	expect(requestUrl.searchParams.get('rss_url')).toBe(
		'https://example.com/feed.xml?topic=a+b&redirect=https%3A%2F%2Fother.example%2Fx%3Fy%3D1%26z%3D2#latest'
	)
	expect(requestUrl.searchParams.has('count')).toBe(false)
	expect(sourceGetJson.mock.calls[0][1]).toContain(
		'rss_url=https%3A%2F%2Fexample.com%2Ffeed.xml%3Ftopic%3Da%2Bb%26redirect%3Dhttps%253A%252F%252Fother.example%252Fx%253Fy%253D1%2526z%253D2%23latest'
	)
})
