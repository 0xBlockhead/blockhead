// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaInstructionSchema from '$/schema/SolanaInstruction.ts'
import SolanaTransactionSchema from '$/schema/SolanaTransaction.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Solana']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
		)
		&& matchStringSegment(params.instructionKind)
		&& matchNonNegativeInteger(params.indexInTransaction)
	))
		error(404, 'Route mapping not applicable')

	const solanaTransactionNetworkSignatureParentSelector = parseRouteEntitySelector(
		schema,
		SolanaTransactionSchema,
		parentData.selector,
		'NetworkSignature'
	)
	if (solanaTransactionNetworkSignatureParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const solanaInstructionSolanaTransactionIndexInTransactionSelector = parseRouteEntitySelector(
		schema,
		SolanaInstructionSchema,
		{
			$transaction: solanaTransactionNetworkSignatureParentSelector,
			instructionKind: params.instructionKind,
			indexInTransaction: Number(params.indexInTransaction),
		},
		'SolanaTransactionIndexInTransaction'
	)
	if (solanaInstructionSolanaTransactionIndexInTransactionSelector instanceof arktype.errors)
		error(404, 'Invalid SolanaInstruction selector')

	return {
		selector: solanaInstructionSolanaTransactionIndexInTransactionSelector,
	}
}
