// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Eip8004AgentRegistrationFileSchema from '$/schema/Eip8004AgentRegistrationFile.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchAbsoluteUrl(params.fileUrl)))
		error(404, 'Route mapping not applicable')

	const eip8004AgentRegistrationFileRegistrationFileUrlSelector = parseEntitySelector(
		schema,
		Eip8004AgentRegistrationFileSchema,
		{
			$registration: parentData.selector,
			fileUrl: decodeURIComponent(params.fileUrl),
		},
		'RegistrationFileUrl'
	)
	if (eip8004AgentRegistrationFileRegistrationFileUrlSelector instanceof arktype.errors)
		error(404, 'Invalid Eip8004AgentRegistrationFile selector')

	return {
		selector: eip8004AgentRegistrationFileRegistrationFileUrlSelector,
	}
}
