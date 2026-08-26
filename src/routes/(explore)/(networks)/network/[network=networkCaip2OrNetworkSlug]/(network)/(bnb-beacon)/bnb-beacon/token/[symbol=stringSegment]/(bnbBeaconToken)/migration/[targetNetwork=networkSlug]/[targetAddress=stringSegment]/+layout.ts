// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BnbBeaconTokenMigrationSchema from '$/schema/BnbBeaconTokenMigration.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['BnbBeacon']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		parentData.projectionNetwork.slug === 'bnb-beacon'
		&& matchNetworkSlug(params.targetNetwork)
		&& matchStringSegment(params.targetAddress)
	))
		error(404, 'Route mapping not applicable')

	const bnbBeaconTokenMigrationTokenTargetNetworkTargetAddressSelector = parseRouteEntitySelector(
		schema,
		BnbBeaconTokenMigrationSchema,
		{
			$token: parentData.selector,
			$targetNetwork: {
				slug: params.targetNetwork,
			},
			targetAddress: params.targetAddress,
		},
		'TokenTargetNetworkTargetAddress'
	)
	if (bnbBeaconTokenMigrationTokenTargetNetworkTargetAddressSelector instanceof arktype.errors)
		error(404, 'Invalid BnbBeaconTokenMigration selector')

	return {
		selector: bnbBeaconTokenMigrationTokenTargetNetworkTargetAddressSelector,
	}
}
