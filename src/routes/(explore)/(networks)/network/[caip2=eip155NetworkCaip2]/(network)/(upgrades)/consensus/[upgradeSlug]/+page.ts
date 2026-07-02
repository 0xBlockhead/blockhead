// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkConsensusUpgradeByChainIdAndRouteSegment } from '$/constants/EthereumNetworkUpgrades.ts'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EthereumConsensusUpgradeSchema from '$/schema/EthereumConsensusUpgrade.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ethereumConsensusUpgradeSelector = parseEntitySelector(
		schema,
		EthereumConsensusUpgradeSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			upgradeId: networkConsensusUpgradeByChainIdAndRouteSegment[String(caip2SelectorValueFromString(decodeURIComponent(params.caip2)).reference) + ':' + String(params.upgradeSlug)].upgradeId,
		}
	)
	if (ethereumConsensusUpgradeSelector instanceof arktype.errors) error(404, 'Invalid EthereumConsensusUpgrade selector')

	return {
		selector: ethereumConsensusUpgradeSelector,
	}
}
