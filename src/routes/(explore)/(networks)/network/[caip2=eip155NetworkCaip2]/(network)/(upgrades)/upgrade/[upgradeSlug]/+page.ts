// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkUpgradeByChainIdAndRouteSegment } from '$/constants/EthereumNetworkUpgrades.ts'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EthereumNetworkUpgradeSchema from '$/schema/EthereumNetworkUpgrade.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ethereumNetworkUpgradeSelector = parseEntitySelector(
		schema,
		EthereumNetworkUpgradeSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			upgradeId: networkUpgradeByChainIdAndRouteSegment[String(caip2SelectorValueFromString(decodeURIComponent(params.caip2)).reference) + ':' + String(params.upgradeSlug)].upgradeId,
		}
	)
	if (ethereumNetworkUpgradeSelector instanceof arktype.errors) error(404, 'Invalid EthereumNetworkUpgrade selector')

	return {
		selector: ethereumNetworkUpgradeSelector,
		title: networkUpgradeByChainIdAndRouteSegment[String(caip2SelectorValueFromString(decodeURIComponent(params.caip2)).reference) + ':' + String(params.upgradeSlug)].name,
	}
}
