import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaTransport } from '$/schema/MediaTransport.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'

const { binding, getOpenGraphWireForPublicHttpUrl } = vi.hoisted(() => ({
	binding: { requestOwner: 'metadata-vision-binding' },
	getOpenGraphWireForPublicHttpUrl: vi.fn(),
}))

vi.mock('$/sources/MetadataVision/Rest/queries.ts', () => ({
	getOpenGraphWireForPublicHttpUrl,
	metadataVisionBinding: binding,
}))

const { default: metadataVision } = await import('$/resolvers/MetadataVision-Rest.ts')
const [urlResolver] = metadataVision.resolvers

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [Source.MetadataVision_Rest],
	publicEnv: {},
}

const articleUrl = 'https://example.com/article'
const imageUrl = 'https://example.com/og.png'

const completeOpenGraphWire = {
	url: articleUrl,
	logo: null,
	author: 'Alice',
	date: null,
	datePublished: null,
	dateModified: null,
	description: 'An example article',
	feed: null,
	image: imageUrl,
	audio: null,
	lang: null,
	publisher: 'Example Site',
	title: 'Example',
	video: null,
}

const emptyOpenGraphWire = {
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
	title: null,
	video: null,
}

describe('MetadataVision REST resolvers', () => {
	beforeEach(() => {
		getOpenGraphWireForPublicHttpUrl.mockReset()
		getOpenGraphWireForPublicHttpUrl.mockResolvedValue(completeOpenGraphWire)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('gives the selected metadata proxy binding ownership of the parent Url read', async () => {
		await urlResolver.resolve.Url.resolve({
			url: articleUrl,
		}, context)

		expect(getOpenGraphWireForPublicHttpUrl).toHaveBeenCalledTimes(1)
		expect(getOpenGraphWireForPublicHttpUrl).toHaveBeenCalledWith(
			binding,
			articleUrl
		)
	})

	it('embeds every supported UrlPreview_Timestamp field from one post-read fetch', async () => {
		const now = vi.spyOn(Date, 'now')
		now.mockReturnValue(1_700_000_000_000)
		getOpenGraphWireForPublicHttpUrl.mockImplementation(async () => {
			now.mockReturnValue(1_700_000_000_123)
			return completeOpenGraphWire
		})

		const snapshot = await urlResolver.resolve.Url.resolve({
			url: articleUrl,
		}, context)

		expect(getOpenGraphWireForPublicHttpUrl).toHaveBeenCalledTimes(1)
		expect(urlResolver.projections.$$previewTimestamps(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$url: { url: articleUrl },
					timestampMs: 1_700_000_000_123,
					source: Source.MetadataVision_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'title')]: 'Example',
					[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'description')]: 'An example article',
					[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'siteName')]: 'Example Site',
					[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'imageUrl')]: imageUrl,
					[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], '$image')]: {
						[EntityMetaKey.Selector]: { url: imageUrl },
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
							[entityFieldAddressKey(EntityType.Media, [], 'transport')]: MediaTransport.Http,
						},
					},
					[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'previewStatus')]: 'ok',
				},
			},
		])
	})

	it('stamps sparse OpenGraph success with previewStatus and omits empty optionals', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_456)
		getOpenGraphWireForPublicHttpUrl.mockResolvedValue(emptyOpenGraphWire)

		const snapshot = await urlResolver.resolve.Url.resolve({
			url: articleUrl,
		}, context)

		expect(urlResolver.projections.$$previewTimestamps(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$url: { url: articleUrl },
					timestampMs: 1_700_000_000_456,
					source: Source.MetadataVision_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'previewStatus')]: 'ok',
				},
			},
		])
	})

	it('propagates public-http transport and validation failures without preview evidence', async () => {
		getOpenGraphWireForPublicHttpUrl.mockRejectedValue(
			new Error('MetadataVision_Rest: unexpected JSON for https://og.metadata.vision/https://example.com/article')
		)

		await expect(urlResolver.resolve.Url.resolve({
			url: articleUrl,
		}, context)).rejects.toThrow('MetadataVision_Rest: unexpected JSON')
		expect(getOpenGraphWireForPublicHttpUrl).toHaveBeenCalledTimes(1)
	})

	it('does not register a direct UrlPreview_Timestamp resolver', () => {
		expect(metadataVision.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.Url,
		])
	})
})
