// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import TonContractGetMethodSchema from '$/schema/TonContractGetMethod.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.methodName)))
		error(404, 'Route mapping not applicable')

	const tonContractGetMethodContractMethodNameSelector = parseRouteEntitySelector(
		schema,
		TonContractGetMethodSchema,
		{
			$contract: parentData.selector,
			methodName: params.methodName,
		},
		'ContractMethodName'
	)
	if (tonContractGetMethodContractMethodNameSelector instanceof arktype.errors)
		error(404, 'Invalid TonContractGetMethod selector')

	return {
		selector: tonContractGetMethodContractMethodNameSelector,
	}
}
