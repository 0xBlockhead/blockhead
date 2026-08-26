// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchUserOperationHash } from '$/params/userOperationHash.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import EvmUserOperationSchema from '$/schema/EvmUserOperation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchUserOperationHash(params.userOperationHash)
	))
		error(404, 'Route mapping not applicable')

	const evmUserOperationEvmNetworkHashSelector = parseRouteEntitySelector(
		schema,
		EvmUserOperationSchema,
		{
			$network: parentData.selector,
			hash: params.userOperationHash,
		},
		'EvmNetworkHash'
	)
	if (evmUserOperationEvmNetworkHashSelector instanceof arktype.errors)
		error(404, 'Invalid EvmUserOperation selector')

	return {
		selector: evmUserOperationEvmNetworkHashSelector,
	}
}
