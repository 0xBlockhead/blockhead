// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import Currency_TimestampSchema from '$/schema/Currency_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const currencyTimestampSelector = parseEntitySelector(
		schema,
		Currency_TimestampSchema,
		{
			$currency: {
				iso4217: decodeURIComponent(params.iso4217),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (currencyTimestampSelector instanceof arktype.errors) error(404, 'Invalid Currency_Timestamp selector')

	return {
		selector: currencyTimestampSelector,
	}
}
