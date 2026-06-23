import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/IcpCanisterMethod.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$canister': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				canisterId: decodeURIComponent(params.canisterId),
			},
			methodName: decodeURIComponent(params.methodName),
			methodKind: decodeURIComponent(params.methodKind),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid IcpCanisterMethod selector')

	return { selector }
}
