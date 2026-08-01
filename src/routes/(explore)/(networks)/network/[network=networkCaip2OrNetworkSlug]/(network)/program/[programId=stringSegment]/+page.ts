// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaProgramSchema from '$/schema/SolanaProgram.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Solana']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
		)
		&& matchStringSegment(params.programId)
	))
		error(404, 'Route mapping not applicable')

	const solanaProgramNetworkProgramIdSelector = parseEntitySelector(
		schema,
		SolanaProgramSchema,
		{
			$network: parentData.selector,
			programId: params.programId,
		},
		'NetworkProgramId'
	)
	if (solanaProgramNetworkProgramIdSelector instanceof arktype.errors)
		error(404, 'Invalid SolanaProgram selector')

	return {
		selector: solanaProgramNetworkProgramIdSelector,
	}
}
