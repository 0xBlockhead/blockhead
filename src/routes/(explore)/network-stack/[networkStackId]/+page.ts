// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NetworkStackSchema from '$/schema/NetworkStack.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const networkStackSelector = parseEntitySelector(
		schema,
		NetworkStackSchema,
		{
			networkStackId: params.networkStackId,
		}
	)
	if (networkStackSelector instanceof arktype.errors) error(404, 'Invalid NetworkStack selector')

	return {
		selector: networkStackSelector,
	}
}
