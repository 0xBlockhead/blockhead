// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import IpfsProtocolSchema from '$/schema/IpfsProtocol.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const ipfsProtocolScopeSelector = parseRouteEntitySelector(
		schema,
		IpfsProtocolSchema,
		{
			scope: 'IpfsProtocol',
		},
		'Scope'
	)
	if (ipfsProtocolScopeSelector instanceof arktype.errors)
		error(404, 'Invalid IpfsProtocol selector')

	return {
		selector: ipfsProtocolScopeSelector,
	}
}
