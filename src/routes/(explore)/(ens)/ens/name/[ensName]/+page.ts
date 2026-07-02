// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EnsNameSchema from '$/schema/EnsName.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ensNameSelector = parseEntitySelector(
		schema,
		EnsNameSchema,
		{
			name: decodeURIComponent(params.ensName),
		}
	)
	if (ensNameSelector instanceof arktype.errors) error(404, 'Invalid EnsName selector')

	return {
		selector: ensNameSelector,
	}
}
