// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadAgentCredentialStateSchema from '$/schema/BlockheadAgentCredentialState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.credentialId)))
		error(404, 'Route mapping not applicable')

	const blockheadAgentCredentialStateCredentialIdSelector = parseEntitySelector(
		schema,
		BlockheadAgentCredentialStateSchema,
		{
			credentialId: params.credentialId,
		},
		'CredentialId'
	)
	if (blockheadAgentCredentialStateCredentialIdSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadAgentCredentialState selector')

	return {
		selector: blockheadAgentCredentialStateCredentialIdSelector,
	}
}
