import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/NearValidator_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$validator': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				accountId: decodeURIComponent(params.accountId),
			},
			epochId: decodeURIComponent(params.epochId),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid NearValidator_Timestamp selector')

	return { selector }
}
