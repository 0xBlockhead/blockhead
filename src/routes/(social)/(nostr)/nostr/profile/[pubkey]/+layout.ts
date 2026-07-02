// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NostrProfileSchema from '$/schema/NostrProfile.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const nostrProfileSelector = parseEntitySelector(
		schema,
		NostrProfileSchema,
		{
			pubkey: decodeURIComponent(params.pubkey),
		}
	)
	if (nostrProfileSelector instanceof arktype.errors) error(404, 'Invalid NostrProfile selector')

	return {
		selector: nostrProfileSelector,
	}
}
