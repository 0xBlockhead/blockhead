import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/FarcasterFeed.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			variant: decodeURIComponent(params.variant),
			viewerFid: decodeURIComponent(params.viewerFid),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid FarcasterFeed selector')

	return { selector }
}
