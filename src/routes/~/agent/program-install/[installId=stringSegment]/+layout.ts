// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadAgentProgramInstallSchema from '$/schema/BlockheadAgentProgramInstall.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.installId)))
		error(404, 'Route mapping not applicable')

	const blockheadAgentProgramInstallInstallIdSelector = parseRouteEntitySelector(
		schema,
		BlockheadAgentProgramInstallSchema,
		{
			installId: params.installId,
		},
		'InstallId'
	)
	if (blockheadAgentProgramInstallInstallIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadAgentProgramInstall selector')

	return {
		selector: blockheadAgentProgramInstallInstallIdSelector,
	}
}
