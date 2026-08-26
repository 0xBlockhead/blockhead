// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AcpAgentProgramSchema from '$/schema/AcpAgentProgram.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.registryAgentId)))
		error(404, 'Route mapping not applicable')

	const acpAgentProgramRegistryAgentIdSelector = parseRouteEntitySelector(
		schema,
		AcpAgentProgramSchema,
		{
			registryAgentId: params.registryAgentId,
		},
		'RegistryAgentId'
	)
	if (acpAgentProgramRegistryAgentIdSelector instanceof arktype.errors)
		error(404, 'Invalid AcpAgentProgram selector')

	return {
		selector: acpAgentProgramRegistryAgentIdSelector,
	}
}
