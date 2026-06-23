import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadLitecoinMwebOutputState.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			walletId: decodeURIComponent(params.walletId),
			commitment: decodeURIComponent(params.commitment),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadLitecoinMwebOutputState selector')

	return { selector }
}
