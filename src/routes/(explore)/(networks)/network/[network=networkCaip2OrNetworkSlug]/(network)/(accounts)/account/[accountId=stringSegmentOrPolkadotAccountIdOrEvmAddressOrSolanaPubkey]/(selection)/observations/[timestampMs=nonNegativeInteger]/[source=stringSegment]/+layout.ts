// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NearAccount_TimestampSchema from '$/schema/NearAccount_Timestamp.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Near']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'Near'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	))
		error(404, 'Route mapping not applicable')

	const nearAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
		schema,
		NearAccount_TimestampSchema,
		{
			$account: parentData.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		},
		'AccountTimestampMsSource'
	)
	if (nearAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors)
		error(404, 'Invalid NearAccount_Timestamp selector')

	return {
		selector: nearAccountTimestampAccountTimestampMsSourceSelector,
	}
}
