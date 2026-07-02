// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LensAccountSchema from '$/schema/LensAccount.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const lensAccountSelector = parseEntitySelector(
		schema,
		LensAccountSchema,
		{
			address: decodeURIComponent(params.address),
		}
	)
	if (lensAccountSelector instanceof arktype.errors) error(404, 'Invalid LensAccount selector')

	return {
		selector: lensAccountSelector,
	}
}
