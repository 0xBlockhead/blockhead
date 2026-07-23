import { expect, test, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	SourceDelivery,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
}))

import { rss2JsonGet } from '$/sources/Rss2Json/Rest/client.ts'

test('uses the registered HttpProxy binding', async () => {
	sourceGetJson.mockResolvedValueOnce({
		status: 'ok',
	})

	await expect(rss2JsonGet('/v1/api.json?rss_url=fixture')).resolves.toEqual({
		status: 'ok',
	})
	expect(sourceGetJson).toHaveBeenCalledWith(
		expect.objectContaining({
			source: Source.Rss2Json_Rest,
			target: {
				kind: SourceTargetKind.Global,
				key: 'rss2json',
			},
			delivery: SourceDelivery.HttpProxy,
		}),
		'https://api.rss2json.com/v1/api.json?rss_url=fixture'
	)
})
