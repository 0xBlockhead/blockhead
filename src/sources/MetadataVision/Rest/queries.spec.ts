import { beforeEach, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/MetadataVision/bindings.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => (
		binding.endpoints[0].locator
	),
	sourceGetJson,
}))

const { getOpenGraphWireForPublicHttpUrl } = await import('$/sources/MetadataVision/Rest/queries.ts')
const binding = bindings[Source.MetadataVision_Rest][0]

beforeEach(() => {
	sourceGetJson.mockReset()
	sourceGetJson.mockResolvedValue({
		ok: true,
		data: {
			url: 'https://example.com/article',
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
		},
	})
})

it('constructs the proxy request exclusively from the selected binding', async () => {
	await getOpenGraphWireForPublicHttpUrl(binding, 'https://example.com/article')

	expect(sourceGetJson).toHaveBeenCalledWith(
		binding,
		'https://og.metadata.vision/https://example.com/article'
	)
})
