// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NetworkSchema from '$/schema/Network.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const networkSelector = parseEntitySelector(
		schema,
		NetworkSchema,
		{
			caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
		}
	)
	if (networkSelector instanceof arktype.errors) error(404, 'Invalid Network selector')

	return {
		selector: networkSelector,
	}
}
