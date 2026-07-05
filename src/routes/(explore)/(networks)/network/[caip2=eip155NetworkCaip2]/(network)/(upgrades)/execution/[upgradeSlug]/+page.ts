// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EthereumExecutionUpgradeSchema from '$/schema/EthereumExecutionUpgrade.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ethereumExecutionUpgradeSelector = parseEntitySelector(
		schema,
		EthereumExecutionUpgradeSchema,
		{
			$network: {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			},
			slug: params.upgradeSlug,
		}
	)
	if (ethereumExecutionUpgradeSelector instanceof arktype.errors) error(404, 'Invalid EthereumExecutionUpgrade selector')

	return {
		selector: ethereumExecutionUpgradeSelector,
	}
}
