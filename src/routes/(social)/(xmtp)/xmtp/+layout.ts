// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XmtpNetworkSchema from '$/schema/XmtpNetwork.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const xmtpNetworkScopeSelector = parseRouteEntitySelector(
		schema,
		XmtpNetworkSchema,
		{
			scope: 'XmtpNetwork',
		},
		'Scope'
	)
	if (xmtpNetworkScopeSelector instanceof arktype.errors)
		error(404, 'Invalid XmtpNetwork selector')

	return {
		selector: xmtpNetworkScopeSelector,
	}
}
