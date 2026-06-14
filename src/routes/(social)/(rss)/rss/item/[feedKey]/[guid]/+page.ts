import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import RssItemSchema from '$/schema/RssItem.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const feedUrl = decodeURIComponent(params.feedKey).trim()
	const guid = decodeURIComponent(params.guid).trim()
	const entitySelector = RssItemSchema.id({
		feedUrl,
		guid,
	})
	if (entitySelector instanceof arktype.errors) error(404, 'Invalid RSS item id')
	return { entitySelector }
}
