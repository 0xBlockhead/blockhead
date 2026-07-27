// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaProgramSchema from '$/schema/SolanaProgram.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Solana']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	if (!((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')) && matchStringSegment(params.programId))) error(404, 'Route mapping not applicable')

	const solanaProgramNetworkProgramIdSelector = parseEntitySelector(
		schema,
		SolanaProgramSchema,
		{
			$network: parentData.selector,
			programId: params.programId,
		}
	)
	if (solanaProgramNetworkProgramIdSelector instanceof arktype.errors) error(404, 'Invalid SolanaProgram selector')

	return {
		selector: solanaProgramNetworkProgramIdSelector,
	}
}
