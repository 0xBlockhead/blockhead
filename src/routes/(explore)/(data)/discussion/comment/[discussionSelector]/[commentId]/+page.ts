import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/RadicleDiscussionComment.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			discussionSelector: decodeURIComponent(params.discussionSelector),
			commentId: decodeURIComponent(params.commentId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid RadicleDiscussionComment selector')

	return { selector }
}
