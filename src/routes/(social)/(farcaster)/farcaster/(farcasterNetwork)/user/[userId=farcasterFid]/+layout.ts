// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchFarcasterFid } from '$/params/farcasterFid.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { FarcasterUser as FarcasterUserSchema } from '$/schema/FarcasterUser.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchFarcasterFid(params.userId))) error(404, 'Route mapping not applicable')

	const farcasterUserFidSelector = parseEntitySelector(
		schema,
		FarcasterUserSchema,
		{
			fid: Number(params.userId),
		}
	)
	if (farcasterUserFidSelector instanceof arktype.errors) error(404, 'Invalid FarcasterUser selector')

	return {
		selector: farcasterUserFidSelector,
	}
}
