import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/ElementsPeg.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
			},
			pegTransactionId: decodeURIComponent(params.pegTransactionId),
			direction: decodeURIComponent(params.direction),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ElementsPeg selector')

	return { selector }
}
