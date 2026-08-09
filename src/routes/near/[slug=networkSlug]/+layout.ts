// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NearNetworkSchema from '$/schema/NearNetwork.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchNetworkSlug(params.slug)))
		error(404, 'Route mapping not applicable')

	const nearNetworkSlugSelector = parseEntitySelector(
		schema,
		NearNetworkSchema,
		{
			slug: params.slug,
		},
		'Slug'
	)
	if (nearNetworkSlugSelector instanceof arktype.errors)
		error(404, 'Invalid NearNetwork selector')

	return {
		selector: nearNetworkSlugSelector,
	}
}
