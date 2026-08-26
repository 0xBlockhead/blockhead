// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MoveModuleSchema from '$/schema/MoveModule.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.address) && matchStringSegment(params.moduleName)))
		error(404, 'Route mapping not applicable')

	const moveModuleNetworkAddressModuleNameSelector = parseRouteEntitySelector(
		schema,
		MoveModuleSchema,
		{
			$network: parentData.selector,
			address: params.address,
			moduleName: params.moduleName,
		},
		'NetworkAddressModuleName'
	)
	if (moveModuleNetworkAddressModuleNameSelector instanceof arktype.errors)
		error(404, 'Invalid MoveModule selector')

	return {
		selector: moveModuleNetworkAddressModuleNameSelector,
	}
}
