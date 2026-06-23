import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/RssItem.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			feedUrl: decodeURIComponent(params.feedUrl),
			guid: decodeURIComponent(params.guid),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid RssItem selector')

	return { selector }
}
