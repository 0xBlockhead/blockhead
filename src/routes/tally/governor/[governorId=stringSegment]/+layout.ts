// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TallyGovernorSchema from '$/schema/TallyGovernor.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.governorId)))
		error(404, 'Route mapping not applicable')

	const tallyGovernorGovernorIdSelector = parseEntitySelector(
		schema,
		TallyGovernorSchema,
		{
			governorId: decodeURIComponent(params.governorId),
		},
		'GovernorId'
	)
	if (tallyGovernorGovernorIdSelector instanceof arktype.errors)
		error(404, 'Invalid TallyGovernor selector')

	return {
		selector: tallyGovernorGovernorIdSelector,
	}
}
