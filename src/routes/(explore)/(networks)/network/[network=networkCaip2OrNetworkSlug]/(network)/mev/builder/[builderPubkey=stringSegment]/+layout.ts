// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MevBuilderSchema from '$/schema/MevBuilder.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchStringSegment(params.builderPubkey)
	))
		error(404, 'Route mapping not applicable')

	const mevBuilderEvmNetworkBuilderPubkeySelector = parseRouteEntitySelector(
		schema,
		MevBuilderSchema,
		{
			$network: parentData.selector,
			builderPubkey: params.builderPubkey,
		},
		'EvmNetworkBuilderPubkey'
	)
	if (mevBuilderEvmNetworkBuilderPubkeySelector instanceof arktype.errors)
		error(404, 'Invalid MevBuilder selector')

	return {
		selector: mevBuilderEvmNetworkBuilderPubkeySelector,
	}
}
