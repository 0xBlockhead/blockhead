// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import IpfsProtocolSchema from '$/schema/IpfsProtocol.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ipfsProtocolSelector = parseEntitySelector(
		schema,
		IpfsProtocolSchema,
		{
			scope: 'IpfsProtocol',
		}
	)
	if (ipfsProtocolSelector instanceof arktype.errors) error(404, 'Invalid IpfsProtocol selector')

	return {
		selector: ipfsProtocolSelector,
	}
}
