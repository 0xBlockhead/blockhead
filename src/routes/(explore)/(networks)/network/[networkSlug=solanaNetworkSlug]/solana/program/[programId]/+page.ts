// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkBySlug } from '$/constants/Network.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SolanaProgramSchema from '$/schema/SolanaProgram.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const solanaProgramSelector = parseEntitySelector(
		schema,
		SolanaProgramSchema,
		{
			$network: {
				caip2: networkBySlug[params.networkSlug].caip2,
			},
			programId: decodeURIComponent(params.programId),
		}
	)
	if (solanaProgramSelector instanceof arktype.errors) error(404, 'Invalid SolanaProgram selector')

	return {
		selector: solanaProgramSelector,
	}
}
