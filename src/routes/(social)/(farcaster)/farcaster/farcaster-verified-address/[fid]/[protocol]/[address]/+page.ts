import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/FarcasterVerifiedAddress.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			fid: decodeURIComponent(params.fid),
			protocol: decodeURIComponent(params.protocol),
			address: decodeURIComponent(params.address),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid FarcasterVerifiedAddress selector')

	return { selector }
}
