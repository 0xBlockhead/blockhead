import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/DydxChainSubaccount.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
			},
			'$account': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				address: decodeURIComponent(params.address),
			},
			subaccountNumber: decodeURIComponent(params.subaccountNumber),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid DydxChainSubaccount selector')

	return { selector }
}
