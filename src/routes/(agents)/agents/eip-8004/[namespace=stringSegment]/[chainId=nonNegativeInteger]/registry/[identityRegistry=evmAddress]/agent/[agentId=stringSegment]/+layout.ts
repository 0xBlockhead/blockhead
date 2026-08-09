// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Eip8004AgentRegistrationSchema from '$/schema/Eip8004AgentRegistration.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchStringSegment(params.namespace)
		&& matchNonNegativeInteger(params.chainId)
		&& matchEvmAddress(params.identityRegistry)
		&& matchStringSegment(params.agentId)
	))
		error(404, 'Route mapping not applicable')

	const eip8004AgentRegistrationNamespaceChainIdIdentityRegistryAgentIdSelector = parseEntitySelector(
		schema,
		Eip8004AgentRegistrationSchema,
		{
			namespace: params.namespace,
			chainId: Number(params.chainId),
			identityRegistry: params.identityRegistry,
			agentId: params.agentId,
		},
		'NamespaceChainIdIdentityRegistryAgentId'
	)
	if (eip8004AgentRegistrationNamespaceChainIdIdentityRegistryAgentIdSelector instanceof arktype.errors)
		error(404, 'Invalid Eip8004AgentRegistration selector')

	return {
		selector: eip8004AgentRegistrationNamespaceChainIdIdentityRegistryAgentIdSelector,
	}
}
