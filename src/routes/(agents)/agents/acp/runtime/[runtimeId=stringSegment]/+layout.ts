// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AcpAgentRuntimeSchema from '$/schema/AcpAgentRuntime.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.runtimeId)))
		error(404, 'Route mapping not applicable')

	const acpAgentRuntimeRuntimeIdSelector = parseEntitySelector(
		schema,
		AcpAgentRuntimeSchema,
		{
			runtimeId: params.runtimeId,
		},
		'RuntimeId'
	)
	if (acpAgentRuntimeRuntimeIdSelector instanceof arktype.errors)
		error(404, 'Invalid AcpAgentRuntime selector')

	return {
		selector: acpAgentRuntimeRuntimeIdSelector,
	}
}
