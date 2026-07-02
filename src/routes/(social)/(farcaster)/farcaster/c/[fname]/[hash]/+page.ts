// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterCastSchema from '$/schema/FarcasterCast.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterCastSelector = parseEntitySelector(
		schema,
		FarcasterCastSchema,
		{
			username: decodeURIComponent(params.fname),
			hashPrefix: decodeURIComponent(params.hash),
		}
	)
	if (farcasterCastSelector instanceof arktype.errors) error(404, 'Invalid FarcasterCast selector')

	return {
		selector: farcasterCastSelector,
	}
}
