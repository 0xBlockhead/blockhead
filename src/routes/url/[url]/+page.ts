import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import UrlSchema from '$/schema/Url.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const entityId = UrlSchema.id({
		url: decodeURIComponent(params.url).trim(),
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid URL')

	return { entityId }
}
