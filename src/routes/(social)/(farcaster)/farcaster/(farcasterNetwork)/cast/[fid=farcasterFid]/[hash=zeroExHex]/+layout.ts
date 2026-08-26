// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchFarcasterFid } from '$/params/farcasterFid.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import FarcasterCastSchema from '$/schema/FarcasterCast.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchFarcasterFid(params.fid) && matchZeroExHex(params.hash)))
		error(404, 'Route mapping not applicable')

	const farcasterCastFidHashSelector = parseRouteEntitySelector(
		schema,
		FarcasterCastSchema,
		{
			fid: Number(params.fid),
			hash: params.hash,
		},
		'FidHash'
	)
	if (farcasterCastFidHashSelector instanceof arktype.errors)
		error(404, 'Invalid FarcasterCast selector')

	return {
		selector: farcasterCastFidHashSelector,
	}
}
