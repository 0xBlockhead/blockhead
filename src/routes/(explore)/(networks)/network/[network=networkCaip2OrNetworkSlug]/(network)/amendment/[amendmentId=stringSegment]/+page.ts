// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import XrplAmendmentSchema from '$/schema/XrplAmendment.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Xrpl']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Xrpl' && matchStringSegment(params.amendmentId)))
		error(404, 'Route mapping not applicable')

	const xrplAmendmentNetworkAmendmentIdSelector = parseEntitySelector(
		schema,
		XrplAmendmentSchema,
		{
			$network: parentData.selector,
			amendmentId: params.amendmentId,
		}
	)
	if (xrplAmendmentNetworkAmendmentIdSelector instanceof arktype.errors)
		error(404, 'Invalid XrplAmendment selector')

	return {
		selector: xrplAmendmentNetworkAmendmentIdSelector,
	}
}
