import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/KaspaAcceptedTransaction.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$acceptingBlock': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				blockHash: decodeURIComponent(params.blockHash),
			},
			'$transaction': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				transactionId: decodeURIComponent(params.transactionId),
			},
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid KaspaAcceptedTransaction selector')

	return { selector }
}
