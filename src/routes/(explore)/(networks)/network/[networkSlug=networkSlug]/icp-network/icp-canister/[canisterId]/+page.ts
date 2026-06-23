import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/IcpCanister.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
			},
			canisterId: decodeURIComponent(params.canisterId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid IcpCanister selector')

	return { selector }
}
