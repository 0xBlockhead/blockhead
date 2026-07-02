// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MevBuilderSchema from '$/schema/MevBuilder.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const mevBuilderSelector = parseEntitySelector(
		schema,
		MevBuilderSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			builderPubkey: decodeURIComponent(params.builderPubkey),
		}
	)
	if (mevBuilderSelector instanceof arktype.errors) error(404, 'Invalid MevBuilder selector')

	return {
		selector: mevBuilderSelector,
	}
}
