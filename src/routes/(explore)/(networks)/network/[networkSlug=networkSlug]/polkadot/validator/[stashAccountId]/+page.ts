// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PolkadotValidatorSchema from '$/schema/PolkadotValidator.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const polkadotValidatorSelector = parseEntitySelector(
		schema,
		PolkadotValidatorSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			stashAccountId: decodeURIComponent(params.stashAccountId),
		}
	)
	if (polkadotValidatorSelector instanceof arktype.errors) error(404, 'Invalid PolkadotValidator selector')

	return {
		selector: polkadotValidatorSelector,
	}
}
