import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/DydxChainSubaccount_Timestamp.ts'
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
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid DydxChainSubaccount_Timestamp selector')

	return { selector }
}
