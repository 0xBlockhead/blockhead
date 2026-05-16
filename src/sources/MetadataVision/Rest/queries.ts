import { type } from 'arktype'

import { getJson } from '$/lib/http.ts'
import { metadataVisionOrigin } from '$/sources/MetadataVision/Rest/constants.ts'
import type { MetadataVisionOpenGraphDataWire } from '$/sources/MetadataVision/Rest/types.ts'
import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

const metadataVisionOrigins: readonly SourceOrigin[] = [
	{
		origin: new URL(metadataVisionOrigin).origin,
		corsEnabled: true,
	},
]

const metadataVisionDataWire = type({
	url: 'string',
	logo: 'string | null',
	author: 'string | null',
	date: 'string | null',
	datePublished: 'string | null',
	dateModified: 'string | null',
	description: 'string | null',
	feed: 'string | null',
	image: 'string | null',
	audio: 'string | null',
	lang: 'string | null',
	publisher: 'string | null',
	title: 'string | null',
	video: 'string | null',
})

const metadataVisionResponseWire = type.or(
	type({
		ok: type.unit(true),
		data: metadataVisionDataWire,
	}),
	type({
		ok: type.unit(false),
		message: 'string',
	}),
)

/**
 * Open Graph snapshot for a public `http(s):` document URL via **`og.metadata.vision`**.
 *
 * @see https://docs.metadata.vision
 */
export const getOpenGraphWireForPublicHttpUrl = async (
	publicHttpUrl: string,
): Promise<MetadataVisionOpenGraphDataWire> => {
	const requestUrl = `${metadataVisionOrigin}/${publicHttpUrl}`
	const json = await getJson(requestUrl, { origins: metadataVisionOrigins })
	const parsed = metadataVisionResponseWire(json)
	if (parsed instanceof type.errors) {
		throw new Error(`MetadataVision_Rest: unexpected JSON for ${requestUrl}`)
	}
	if (parsed.ok === false) {
		throw new Error(parsed.message)
	}
	return parsed.data
}
