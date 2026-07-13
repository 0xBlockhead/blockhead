// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { EnsName as EnsNameSchema } from '$/schema/EnsName.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.ensName))) error(404, 'Route mapping not applicable')

	const ensNameNormalizedNameSelector = parseEntitySelector(
		schema,
		EnsNameSchema,
		{
			name: params.ensName,
		}
	)
	if (ensNameNormalizedNameSelector instanceof arktype.errors) error(404, 'Invalid EnsName selector')

	return {
		selector: ensNameNormalizedNameSelector,
	}
}
