import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/IcpCertifiedState.ts'
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
			certificateHash: decodeURIComponent(params.certificateHash),
			pathHash: decodeURIComponent(params.pathHash),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid IcpCertifiedState selector')

	return { selector }
}
