// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import AccountSchema from '$/schema/Account.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchStringSegment(params.namespace)
		&& matchStringSegment(params.reference)
		&& matchStringSegment(params.accountAddress)
	))
		error(404, 'Route mapping not applicable')

	const accountCaip10Selector = parseEntitySelector(
		schema,
		AccountSchema,
		{
			caip10: {
				namespace: params.namespace,
				reference: params.reference,
				accountAddress: params.accountAddress,
			},
		},
		'Caip10'
	)
	if (accountCaip10Selector instanceof arktype.errors)
		error(404, 'Invalid Account selector')

	return {
		selector: accountCaip10Selector,
	}
}
