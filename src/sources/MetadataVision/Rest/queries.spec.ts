import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/MetadataVision/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { getOpenGraphWireForPublicHttpUrl } = await import('$/sources/MetadataVision/Rest/queries.ts')
const binding = bindings[Source.MetadataVision_Rest][0]
const articleUrl = 'https://example.com/article'
const requestUrl = 'https://og.metadata.vision/https://example.com/article'
const openGraphData = {
	url: articleUrl,
	logo: null,
	author: null,
	date: null,
	datePublished: null,
	dateModified: null,
	description: null,
	feed: null,
	image: null,
	audio: null,
	lang: null,
	publisher: null,
	title: 'Example',
	video: null,
}

beforeEach(() => {
	sourceGetJson.mockReset()
})

it('returns Open Graph data from a healthy MetadataVision envelope', async () => {
	sourceGetJson.mockResolvedValueOnce({
		ok: true,
		data: openGraphData,
	})

	await expect(getOpenGraphWireForPublicHttpUrl(binding, articleUrl)).resolves.toEqual(openGraphData)
	expect(sourceGetJson).toHaveBeenCalledOnce()
	expect(sourceGetJson).toHaveBeenCalledWith(
		binding,
		requestUrl
	)
})

it.each([
	{},
	{
		ok: true,
	},
	{
		ok: true,
		data: {
			title: 'Example',
		},
	},
	{
		ok: true,
		data: {
			...openGraphData,
			title: 42,
		},
	},
	{
		ok: false,
	},
])('fails closed on malformed Open Graph response %#', async (response) => {
	sourceGetJson.mockResolvedValueOnce(response)

	await expect(getOpenGraphWireForPublicHttpUrl(binding, articleUrl)).rejects.toThrow(
		`MetadataVision_Rest: unexpected JSON for ${requestUrl}`
	)
})

it('fails closed with the provider message when ok is false', async () => {
	sourceGetJson.mockResolvedValueOnce({
		ok: false,
		message: 'fetch failed',
	})

	await expect(getOpenGraphWireForPublicHttpUrl(binding, articleUrl)).rejects.toThrow(
		'fetch failed'
	)
})
