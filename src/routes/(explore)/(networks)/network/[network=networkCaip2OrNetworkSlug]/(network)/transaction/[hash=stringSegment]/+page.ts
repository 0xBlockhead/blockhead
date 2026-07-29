// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplTransactionSchema from '$/schema/XrplTransaction.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Xrpl' && matchStringSegment(params.hash)))
		error(404, 'Route mapping not applicable')

	const xrplTransactionNetworkHashSelector = parseEntitySelector(
		schema,
		XrplTransactionSchema,
		{
			$network: parentData.selector,
			hash: params.hash,
		}
	)
	if (xrplTransactionNetworkHashSelector instanceof arktype.errors)
		error(404, 'Invalid XrplTransaction selector')

	return {
		selector: xrplTransactionNetworkHashSelector,
	}
}
