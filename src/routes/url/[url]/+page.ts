import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import UrlSchema from '$/schema/Url.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const entitySelector = parseEntitySelector(schema, UrlSchema, {
		url: decodeURIComponent(params.url).trim(),
	})
	if (entitySelector instanceof arktype.errors) error(404, 'Invalid URL')

	return { entitySelector }
}
