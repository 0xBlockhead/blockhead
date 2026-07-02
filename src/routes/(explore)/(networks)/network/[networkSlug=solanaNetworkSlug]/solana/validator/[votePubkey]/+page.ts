// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaValidatorSchema from '$/schema/SolanaValidator.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaValidatorSelector = parseEntitySelector(
		schema,
		SolanaValidatorSchema,
		{
			$network: {
				caip2: networkBySlug[params.networkSlug].caip2,
			},
			votePubkey: decodeURIComponent(params.votePubkey),
		}
	)
	if (solanaValidatorSelector instanceof arktype.errors) error(404, 'Invalid SolanaValidator selector')

	return {
		selector: solanaValidatorSelector,
	}
}
