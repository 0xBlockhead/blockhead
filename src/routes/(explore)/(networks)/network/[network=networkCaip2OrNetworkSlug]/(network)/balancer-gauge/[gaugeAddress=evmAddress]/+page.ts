// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BalancerGaugeSchema from '$/schema/BalancerGauge.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
			)
			&& parentData.projectionNetwork.namespace === 'Evm'
		)
		&& matchEvmAddress(params.gaugeAddress)
	))
		error(404, 'Route mapping not applicable')

	const balancerGaugeNetworkGaugeAddressSelector = parseEntitySelector(
		schema,
		BalancerGaugeSchema,
		{
			$network: parentData.selector,
			gaugeAddress: params.gaugeAddress,
		},
		'NetworkGaugeAddress'
	)
	if (balancerGaugeNetworkGaugeAddressSelector instanceof arktype.errors)
		error(404, 'Invalid BalancerGauge selector')

	return {
		selector: balancerGaugeNetworkGaugeAddressSelector,
	}
}
