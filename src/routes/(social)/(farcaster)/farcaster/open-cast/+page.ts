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
			fid: 3,
			hash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
		}
	)
	if (farcasterCastSelector instanceof arktype.errors) error(404, 'Invalid FarcasterCast selector')

	return {
		selector: farcasterCastSelector,
	}
}
