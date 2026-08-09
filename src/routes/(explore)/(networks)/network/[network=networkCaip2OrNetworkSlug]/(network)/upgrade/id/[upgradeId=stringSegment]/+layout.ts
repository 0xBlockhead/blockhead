// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NetworkUpgradeSchema from '$/schema/NetworkUpgrade.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.upgradeId)))
		error(404, 'Route mapping not applicable')

	const networkUpgradeNetworkUpgradeIdSelector = parseEntitySelector(
		schema,
		NetworkUpgradeSchema,
		{
			$network: parentData.selector,
			upgradeId: params.upgradeId,
		},
		'NetworkUpgradeId'
	)
	if (networkUpgradeNetworkUpgradeIdSelector instanceof arktype.errors)
		error(404, 'Invalid NetworkUpgrade selector')

	return {
		selector: networkUpgradeNetworkUpgradeIdSelector,
	}
}
