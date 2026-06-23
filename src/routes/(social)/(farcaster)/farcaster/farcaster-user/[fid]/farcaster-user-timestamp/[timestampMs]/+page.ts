import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/FarcasterUser_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$user': {
				fid: decodeURIComponent(params.fid),
			},
			timestampMs: Number(params.timestampMs),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid FarcasterUser_Timestamp selector')

	return { selector }
}
