import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/DydxChainOrder.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$subaccount': {
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
			},
			orderId: decodeURIComponent(params.orderId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid DydxChainOrder selector')

	return { selector }
}
