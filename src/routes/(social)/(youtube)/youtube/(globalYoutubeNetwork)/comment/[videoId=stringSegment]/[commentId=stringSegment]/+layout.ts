// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { YoutubeComment as YoutubeCommentSchema } from '$/schema/YoutubeComment.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.videoId) && matchStringSegment(params.commentId))) error(404, 'Route mapping not applicable')

	const youtubeCommentVideoIdCommentIdSelector = parseEntitySelector(
		schema,
		YoutubeCommentSchema,
		{
			videoId: params.videoId,
			commentId: params.commentId,
		}
	)
	if (youtubeCommentVideoIdCommentIdSelector instanceof arktype.errors) error(404, 'Invalid YoutubeComment selector')

	return {
		selector: youtubeCommentVideoIdCommentIdSelector,
	}
}
