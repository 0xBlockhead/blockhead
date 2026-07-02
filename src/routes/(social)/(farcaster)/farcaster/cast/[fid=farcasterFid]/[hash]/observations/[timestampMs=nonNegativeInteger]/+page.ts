// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterCast_TimestampSchema from '$/schema/FarcasterCast_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterCastTimestampSelector = parseEntitySelector(
		schema,
		FarcasterCast_TimestampSchema,
		{
			$cast: {
				fid: Number(params.fid),
				hash: decodeURIComponent(params.hash),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (farcasterCastTimestampSelector instanceof arktype.errors) error(404, 'Invalid FarcasterCast_Timestamp selector')

	return {
		selector: farcasterCastTimestampSelector,
	}
}
