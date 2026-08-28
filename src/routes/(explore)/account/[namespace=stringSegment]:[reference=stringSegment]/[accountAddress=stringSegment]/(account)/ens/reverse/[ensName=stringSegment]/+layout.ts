// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AccountSchema from '$/schema/Account.ts'
import EnsReverseRecordSchema from '$/schema/EnsReverseRecord.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.ensName)))
		error(404, 'Route mapping not applicable')

	const accountCaip10ParentSelector = parseRouteEntitySelector(
		schema,
		AccountSchema,
		parentData.selector,
		'Caip10'
	)
	if (accountCaip10ParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const ensReverseRecordAccountNameSelector = parseRouteEntitySelector(
		schema,
		EnsReverseRecordSchema,
		{
			$account: accountCaip10ParentSelector,
			$name: {
				name: decodeURIComponent(params.ensName),
			},
		},
		'AccountName'
	)
	if (ensReverseRecordAccountNameSelector instanceof arktype.errors)
		error(404, 'Invalid EnsReverseRecord selector')

	return {
		selector: ensReverseRecordAccountNameSelector,
	}
}
