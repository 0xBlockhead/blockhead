import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import RssFeedSchema from '$/schema/RssFeed.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const feedUrl = decodeURIComponent(params.feedKey).trim()
	const entityId = RssFeedSchema.id({ feedUrl })
	if (entityId instanceof arktype.errors) error(404, 'Invalid RSS feed URL')
	return { entityId }
}
