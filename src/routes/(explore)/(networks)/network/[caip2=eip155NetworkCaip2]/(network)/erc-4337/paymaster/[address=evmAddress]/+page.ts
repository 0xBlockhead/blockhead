// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Erc4337PaymasterSchema from '$/schema/Erc4337Paymaster.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const erc4337PaymasterSelector = parseEntitySelector(
		schema,
		Erc4337PaymasterSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			address: decodeURIComponent(params.address),
		}
	)
	if (erc4337PaymasterSelector instanceof arktype.errors) error(404, 'Invalid Erc4337Paymaster selector')

	return {
		selector: erc4337PaymasterSelector,
	}
}
