// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotAccountSchema from '$/schema/PolkadotAccount.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const polkadotAccountSelector = parseEntitySelector(
		schema,
		PolkadotAccountSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			accountId: decodeURIComponent(params.accountId),
		}
	)
	if (polkadotAccountSelector instanceof arktype.errors) error(404, 'Invalid PolkadotAccount selector')

	return {
		selector: polkadotAccountSelector,
	}
}
