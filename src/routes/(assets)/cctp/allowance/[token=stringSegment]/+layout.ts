// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CctpAllowanceSchema from '$/schema/CctpAllowance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.token)))
		error(404, 'Route mapping not applicable')

	const cctpAllowanceTokenSelector = parseEntitySelector(
		schema,
		CctpAllowanceSchema,
		{
			token: params.token,
		},
		'Token'
	)
	if (cctpAllowanceTokenSelector instanceof arktype.errors)
		error(404, 'Invalid CctpAllowance selector')

	return {
		selector: cctpAllowanceTokenSelector,
	}
}
