// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import IcpCanisterMethodSchema from '$/schema/IcpCanisterMethod.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['InternetComputer']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.namespace === 'InternetComputer'
		&& matchStringSegment(params.methodName)
		&& matchStringSegment(params.methodKind)
	))
		error(404, 'Route mapping not applicable')

	const icpCanisterMethodCanisterMethodNameMethodKindSelector = parseRouteEntitySelector(
		schema,
		IcpCanisterMethodSchema,
		{
			$canister: parentData.selector,
			methodName: params.methodName,
			methodKind: params.methodKind,
		},
		'CanisterMethodNameMethodKind'
	)
	if (icpCanisterMethodCanisterMethodNameMethodKindSelector instanceof arktype.errors)
		error(404, 'Invalid IcpCanisterMethod selector')

	return {
		selector: icpCanisterMethodCanisterMethodNameMethodKindSelector,
	}
}
