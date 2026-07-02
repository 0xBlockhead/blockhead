// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LightningNodeSchema from '$/schema/LightningNode.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const lightningNodeSelector = parseEntitySelector(
		schema,
		LightningNodeSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			publicKey: params.pubkey,
		}
	)
	if (lightningNodeSelector instanceof arktype.errors) error(404, 'Invalid LightningNode selector')

	return {
		selector: lightningNodeSelector,
	}
}
