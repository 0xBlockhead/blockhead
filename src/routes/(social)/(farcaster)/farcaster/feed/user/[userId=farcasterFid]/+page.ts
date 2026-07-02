// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterFeedSchema from '$/schema/FarcasterFeed.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterFeedSelector = parseEntitySelector(
		schema,
		FarcasterFeedSchema,
		{
			variant: 'byUser',
			fid: Number(params.userId),
		}
	)
	if (farcasterFeedSelector instanceof arktype.errors) error(404, 'Invalid FarcasterFeed selector')

	return {
		selector: farcasterFeedSelector,
	}
}
