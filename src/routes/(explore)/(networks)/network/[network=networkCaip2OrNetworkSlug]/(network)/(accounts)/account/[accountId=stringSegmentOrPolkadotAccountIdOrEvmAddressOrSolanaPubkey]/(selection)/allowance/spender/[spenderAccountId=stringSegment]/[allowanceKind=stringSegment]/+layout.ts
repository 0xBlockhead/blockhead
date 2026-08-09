// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HederaAllowanceSchema from '$/schema/HederaAllowance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.allowanceKind) && matchStringSegment(params.spenderAccountId)))
		error(404, 'Route mapping not applicable')

	const hederaAllowanceOwnerSpenderAllowanceKindSelector = parseEntitySelector(
		schema,
		HederaAllowanceSchema,
		{
			$owner: parentData.selector,
			$spender: {
				$network: selector.$owner.$network,
				accountId: params.spenderAccountId,
			},
			allowanceKind: params.allowanceKind,
		},
		'OwnerSpenderAllowanceKind'
	)
	if (hederaAllowanceOwnerSpenderAllowanceKindSelector instanceof arktype.errors)
		error(404, 'Invalid HederaAllowance selector')

	return {
		selector: hederaAllowanceOwnerSpenderAllowanceKindSelector,
	}
}
