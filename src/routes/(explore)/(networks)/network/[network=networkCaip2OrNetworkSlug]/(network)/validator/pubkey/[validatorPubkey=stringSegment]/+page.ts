// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconValidatorSchema from '$/schema/BeaconValidator.ts'
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
		&& matchStringSegment(params.validatorPubkey)
	))
		error(404, 'Route mapping not applicable')

	const beaconValidatorNetworkPubkeySelector = parseEntitySelector(
		schema,
		BeaconValidatorSchema,
		{
			$network: parentData.selector,
			pubkey: params.validatorPubkey,
		},
		'NetworkPubkey'
	)
	if (beaconValidatorNetworkPubkeySelector instanceof arktype.errors)
		error(404, 'Invalid BeaconValidator selector')

	return {
		selector: beaconValidatorNetworkPubkeySelector,
	}
}
