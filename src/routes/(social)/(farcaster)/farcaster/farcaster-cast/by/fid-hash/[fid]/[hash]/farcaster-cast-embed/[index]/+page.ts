import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/FarcasterCastEmbed.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$cast': {
				fid: decodeURIComponent(params.fid),
				hash: decodeURIComponent(params.hash),
			},
			index: Number(params.index),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid FarcasterCastEmbed selector')

	return { selector }
}
