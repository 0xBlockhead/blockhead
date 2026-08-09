// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NearAccessKeySchema from '$/schema/NearAccessKey.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Near']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.publicKey)))
		error(404, 'Route mapping not applicable')

	const nearAccessKeyNearAccountPublicKeySelector = parseEntitySelector(
		schema,
		NearAccessKeySchema,
		{
			$account: parentData.selector,
			publicKey: params.publicKey,
		},
		'NearAccountPublicKey'
	)
	if (nearAccessKeyNearAccountPublicKeySelector instanceof arktype.errors)
		error(404, 'Invalid NearAccessKey selector')

	return {
		selector: nearAccessKeyNearAccountPublicKeySelector,
	}
}
