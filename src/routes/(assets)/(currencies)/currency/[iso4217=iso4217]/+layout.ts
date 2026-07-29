// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchIso4217 } from '$/params/iso4217.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CurrencySchema from '$/schema/Currency.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchIso4217(params.iso4217)))
		error(404, 'Route mapping not applicable')

	const currencyIso4217Selector = parseEntitySelector(
		schema,
		CurrencySchema,
		{
			iso4217: params.iso4217,
		}
	)
	if (currencyIso4217Selector instanceof arktype.errors)
		error(404, 'Invalid Currency selector')

	return {
		selector: currencyIso4217Selector,
	}
}
