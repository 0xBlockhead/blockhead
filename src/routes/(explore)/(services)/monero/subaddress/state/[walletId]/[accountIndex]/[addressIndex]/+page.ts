import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadMoneroSubaddressState.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			walletId: decodeURIComponent(params.walletId),
			accountIndex: decodeURIComponent(params.accountIndex),
			addressIndex: decodeURIComponent(params.addressIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadMoneroSubaddressState selector')

	return { selector }
}
