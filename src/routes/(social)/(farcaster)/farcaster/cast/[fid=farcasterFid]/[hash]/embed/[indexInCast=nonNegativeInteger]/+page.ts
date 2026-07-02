// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterCastEmbedSchema from '$/schema/FarcasterCastEmbed.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterCastEmbedSelector = parseEntitySelector(
		schema,
		FarcasterCastEmbedSchema,
		{
			$cast: {
				fid: Number(params.fid),
				hash: decodeURIComponent(params.hash),
			},
			indexInCast: Number(params.indexInCast),
		}
	)
	if (farcasterCastEmbedSelector instanceof arktype.errors) error(404, 'Invalid FarcasterCastEmbed selector')

	return {
		selector: farcasterCastEmbedSelector,
	}
}
