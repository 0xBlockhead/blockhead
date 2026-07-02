// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadPanelTreeSchema from '$/schema/BlockheadPanelTree.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadPanelTreeSelector = parseEntitySelector(
		schema,
		BlockheadPanelTreeSchema,
		{
			id: params.dashboardId,
		}
	)
	if (blockheadPanelTreeSelector instanceof arktype.errors) error(404, 'Invalid BlockheadPanelTree selector')

	return {
		selector: blockheadPanelTreeSelector,
	}
}
