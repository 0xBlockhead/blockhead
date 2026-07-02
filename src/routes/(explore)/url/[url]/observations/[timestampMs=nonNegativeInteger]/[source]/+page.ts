// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import UrlPreview_TimestampSchema from '$/schema/UrlPreview_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const urlPreviewTimestampSelector = parseEntitySelector(
		schema,
		UrlPreview_TimestampSchema,
		{
			$url: {
				url: decodeURIComponent(params.url),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (urlPreviewTimestampSelector instanceof arktype.errors) error(404, 'Invalid UrlPreview_Timestamp selector')

	return {
		selector: urlPreviewTimestampSelector,
	}
}
