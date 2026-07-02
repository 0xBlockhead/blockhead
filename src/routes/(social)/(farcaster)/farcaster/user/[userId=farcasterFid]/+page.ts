// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterUserSchema from '$/schema/FarcasterUser.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterUserSelector = parseEntitySelector(
		schema,
		FarcasterUserSchema,
		{
			fid: Number(params.userId),
		}
	)
	if (farcasterUserSelector instanceof arktype.errors) error(404, 'Invalid FarcasterUser selector')

	return {
		selector: farcasterUserSelector,
	}
}
