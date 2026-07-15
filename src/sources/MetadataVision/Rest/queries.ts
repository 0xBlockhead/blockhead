import { type } from 'arktype'

import { getJson } from '$/lib/http.ts'
import {
	metadataVisionOrigin,
	metadataVisionOrigins,
} from '$/sources/MetadataVision/Rest/constants.ts'
import type { MetadataVisionOpenGraphData } from '$/sources/MetadataVision/Rest/types.ts'

const metadataVisionOpenGraphData = type({
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

const metadataVisionResponse = type.or(
	type({
		ok: type.unit(true),
		data: metadataVisionOpenGraphData,
	}),
	type({
		ok: type.unit(false),
		message: 'string',
	})
)

/**
 * Open Graph snapshot for a public `http(s):` document URL via **`og.metadata.vision`**.
 *
 * @see https://docs.metadata.vision
 */
export const getOpenGraphWireForPublicHttpUrl = async (
	publicHttpUrl: string
): Promise<MetadataVisionOpenGraphData> => {
	const requestUrl = `${metadataVisionOrigin}/${publicHttpUrl}`
	const json = await getJson(requestUrl, { origins: metadataVisionOrigins })
	const parsed = metadataVisionResponse(json)
	if (parsed instanceof type.errors) {
		throw new Error(`MetadataVision_Rest: unexpected JSON for ${requestUrl}`)
	}
	if (parsed.ok === false) {
		throw new Error(parsed.message)
	}
	return parsed.data
}
