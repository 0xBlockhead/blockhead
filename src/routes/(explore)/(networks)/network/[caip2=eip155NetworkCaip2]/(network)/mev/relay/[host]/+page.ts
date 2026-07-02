// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MevRelaySchema from '$/schema/MevRelay.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const mevRelaySelector = parseEntitySelector(
		schema,
		MevRelaySchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			host: decodeURIComponent(params.host),
		}
	)
	if (mevRelaySelector instanceof arktype.errors) error(404, 'Invalid MevRelay selector')

	return {
		selector: mevRelaySelector,
	}
}
