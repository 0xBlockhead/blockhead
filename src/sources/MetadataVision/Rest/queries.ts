import { type } from 'arktype'

import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/MetadataVision/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.MetadataVision_Rest]

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
) => {
	const requestUrl = `${firstHttpUrlForBinding(binding)}/${publicHttpUrl}`
	const json = await sourceGetJson(binding, requestUrl)
	const parsed = metadataVisionResponse(json)
	if (parsed instanceof type.errors) {
		throw new Error(`MetadataVision_Rest: unexpected JSON for ${requestUrl}`)
	}
	if (parsed.ok === false) {
		throw new Error(parsed.message)
	}
	return parsed.data
}
