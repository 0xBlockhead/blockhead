// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaInstructionSchema from '$/schema/SolanaInstruction.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaInstructionSelector = parseEntitySelector(
		schema,
		SolanaInstructionSchema,
		{
			$transaction: {
				$network: {
					caip2: networkBySlug[params.networkSlug].caip2,
				},
				signature: decodeURIComponent(params.signature),
			},
			instructionKind: decodeURIComponent(params.instructionKind),
			indexInTransaction: Number(params.indexInTransaction),
			indexInInstruction: Number(params.indexInInstruction),
		}
	)
	if (solanaInstructionSelector instanceof arktype.errors) error(404, 'Invalid SolanaInstruction selector')

	return {
		selector: solanaInstructionSelector,
	}
}
