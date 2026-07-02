// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Erc4337AccountFactorySchema from '$/schema/Erc4337AccountFactory.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const erc4337AccountFactorySelector = parseEntitySelector(
		schema,
		Erc4337AccountFactorySchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			address: decodeURIComponent(params.address),
		}
	)
	if (erc4337AccountFactorySelector instanceof arktype.errors) error(404, 'Invalid Erc4337AccountFactory selector')

	return {
		selector: erc4337AccountFactorySelector,
	}
}
