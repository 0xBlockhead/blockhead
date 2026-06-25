import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadMoneroTransferState.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			walletId: decodeURIComponent(params.walletId),
			txHash: decodeURIComponent(params.txHash),
			transferIndex: decodeURIComponent(params.transferIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadMoneroTransferState selector')

	return { selector }
}
