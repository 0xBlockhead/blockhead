import { expect, it, vi } from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const { binding, getOpenGraphWireForPublicHttpUrl } = vi.hoisted(() => ({
	binding: { requestOwner: 'metadata-vision-binding' },
	getOpenGraphWireForPublicHttpUrl: vi.fn().mockResolvedValue({
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
	}),
}))

vi.mock('$/sources/MetadataVision/Rest/queries.ts', () => ({
	getOpenGraphWireForPublicHttpUrl,
	metadataVisionBinding: binding,
}))

const { default: metadataVision } = await import('$/resolvers/MetadataVision-Rest.ts')

it('gives the selected metadata proxy binding ownership of the resolver request', async () => {
	const previewResolver = metadataVision.resolvers.find(({ entityType }) => (
		entityType === EntityType.UrlPreview_Timestamp
	))
	if (previewResolver == null || !('UrlTimestampMsSource' in previewResolver.resolve))
		throw new Error('MetadataVision_Rest preview resolver is missing')

	await previewResolver.resolve.UrlTimestampMsSource.resolve({
		$url: { url: 'https://example.com/article' },
		timestampMs: 1,
		source: Source.MetadataVision_Rest,
	}, {
		filters: [],
		sorts: [],
		pagination: {},
		selectorKeys: [],
		parentSelectorKeys: [],
		sources: [],
		publicEnv: {},
	})

	expect(getOpenGraphWireForPublicHttpUrl).toHaveBeenCalledWith(
		binding,
		'https://example.com/article'
	)
})
