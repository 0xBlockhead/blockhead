// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AcpSessionSchema from '$/schema/AcpSession.ts'
import AcpTerminalSchema from '$/schema/AcpTerminal.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.terminalId)))
		error(404, 'Route mapping not applicable')

	const acpSessionSessionIdParentSelector = parseRouteEntitySelector(
		schema,
		AcpSessionSchema,
		parentData.selector,
		'SessionId'
	)
	if (acpSessionSessionIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const acpTerminalSessionTerminalIdSelector = parseRouteEntitySelector(
		schema,
		AcpTerminalSchema,
		{
			$session: acpSessionSessionIdParentSelector,
			terminalId: params.terminalId,
		},
		'SessionTerminalId'
	)
	if (acpTerminalSessionTerminalIdSelector instanceof arktype.errors)
		error(404, 'Invalid AcpTerminal selector')

	return {
		selector: acpTerminalSessionTerminalIdSelector,
	}
}
