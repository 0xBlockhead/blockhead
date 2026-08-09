// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HederaTokenAssociationSchema from '$/schema/HederaTokenAssociation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.tokenId)))
		error(404, 'Route mapping not applicable')

	const hederaTokenAssociationAccountTokenSelector = parseEntitySelector(
		schema,
		HederaTokenAssociationSchema,
		{
			$account: parentData.selector,
			$token: {
				$network: selector.$account.$network,
				tokenId: params.tokenId,
			},
		},
		'AccountToken'
	)
	if (hederaTokenAssociationAccountTokenSelector instanceof arktype.errors)
		error(404, 'Invalid HederaTokenAssociation selector')

	return {
		selector: hederaTokenAssociationAccountTokenSelector,
	}
}
