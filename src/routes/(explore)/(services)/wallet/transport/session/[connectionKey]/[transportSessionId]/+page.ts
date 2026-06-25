import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadWalletTransportSession.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			connectionKey: decodeURIComponent(params.connectionKey),
			transportSessionId: decodeURIComponent(params.transportSessionId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadWalletTransportSession selector')

	return { selector }
}
