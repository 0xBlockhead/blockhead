// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import EasAttestationSchema from '$/schema/EasAttestation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchZeroExHex(params.uid)))
		error(404, 'Route mapping not applicable')

	const easAttestationNetworkUidSelector = parseRouteEntitySelector(
		schema,
		EasAttestationSchema,
		{
			$network: parentData.selector,
			uid: params.uid,
		},
		'NetworkUid'
	)
	if (easAttestationNetworkUidSelector instanceof arktype.errors)
		error(404, 'Invalid EasAttestation selector')

	return {
		selector: easAttestationNetworkUidSelector,
	}
}
