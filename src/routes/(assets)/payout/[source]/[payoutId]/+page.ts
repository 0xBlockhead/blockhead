import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/Payout.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			source: decodeURIComponent(params.source),
			payoutId: decodeURIComponent(params.payoutId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid Payout selector')

	return { selector }
}
