// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalActivityPubNetworkSchema from '$/schema/_GlobalActivityPubNetwork.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const globalActivityPubNetworkSelector = parseEntitySelector(
		schema,
		_GlobalActivityPubNetworkSchema,
		{
			scope: '_GlobalActivityPubNetwork',
		}
	)
	if (globalActivityPubNetworkSelector instanceof arktype.errors) error(404, 'Invalid _GlobalActivityPubNetwork selector')

	return {
		selector: globalActivityPubNetworkSelector,
	}
}
