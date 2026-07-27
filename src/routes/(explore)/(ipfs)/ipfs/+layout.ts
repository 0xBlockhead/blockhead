// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import IpfsProtocolSchema from '$/schema/IpfsProtocol.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const ipfsProtocolScopeSelector = parseEntitySelector(
		schema,
		IpfsProtocolSchema,
		{
			scope: 'IpfsProtocol',
		}
	)
	if (ipfsProtocolScopeSelector instanceof arktype.errors) error(404, 'Invalid IpfsProtocol selector')

	return {
		selector: ipfsProtocolScopeSelector,
	}
}
