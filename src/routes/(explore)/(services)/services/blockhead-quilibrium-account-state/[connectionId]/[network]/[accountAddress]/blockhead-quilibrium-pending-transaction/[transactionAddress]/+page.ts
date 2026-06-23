import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadQuilibriumPendingTransaction.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$accountState': {
				connectionId: decodeURIComponent(params.connectionId),
				network: decodeURIComponent(params.network),
				accountAddress: decodeURIComponent(params.accountAddress),
			},
			transactionAddress: decodeURIComponent(params.transactionAddress),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadQuilibriumPendingTransaction selector')

	return { selector }
}
