import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/CctpFee.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			apiHost: decodeURIComponent(params.apiHost),
			fromDomain: decodeURIComponent(params.fromDomain),
			toDomain: decodeURIComponent(params.toDomain),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid CctpFee selector')

	return { selector }
}
