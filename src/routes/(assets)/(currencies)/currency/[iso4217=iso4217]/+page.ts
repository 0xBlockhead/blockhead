// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CurrencySchema from '$/schema/Currency.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const currencySelector = parseEntitySelector(
		schema,
		CurrencySchema,
		{
			iso4217: decodeURIComponent(params.iso4217),
		}
	)
	if (currencySelector instanceof arktype.errors) error(404, 'Invalid Currency selector')

	return {
		selector: currencySelector,
	}
}
