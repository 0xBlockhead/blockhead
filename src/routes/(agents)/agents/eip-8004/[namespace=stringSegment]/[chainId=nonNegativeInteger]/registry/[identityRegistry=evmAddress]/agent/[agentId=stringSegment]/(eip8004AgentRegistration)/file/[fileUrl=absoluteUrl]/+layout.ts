// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import Eip8004AgentRegistrationSchema from '$/schema/Eip8004AgentRegistration.ts'
import Eip8004AgentRegistrationFileSchema from '$/schema/Eip8004AgentRegistrationFile.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchAbsoluteUrl(params.fileUrl)))
		error(404, 'Route mapping not applicable')

	const eip8004AgentRegistrationNamespaceChainIdIdentityRegistryAgentIdParentSelector = parseRouteEntitySelector(
		schema,
		Eip8004AgentRegistrationSchema,
		parentData.selector,
		'NamespaceChainIdIdentityRegistryAgentId'
	)
	if (eip8004AgentRegistrationNamespaceChainIdIdentityRegistryAgentIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const eip8004AgentRegistrationFileRegistrationFileUrlSelector = parseRouteEntitySelector(
		schema,
		Eip8004AgentRegistrationFileSchema,
		{
			$registration: eip8004AgentRegistrationNamespaceChainIdIdentityRegistryAgentIdParentSelector,
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
