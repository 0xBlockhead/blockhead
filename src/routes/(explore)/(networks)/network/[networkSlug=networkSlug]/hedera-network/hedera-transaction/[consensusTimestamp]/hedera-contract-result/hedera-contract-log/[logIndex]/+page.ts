import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/HederaContractLog.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$result': {
				'$transaction': {
					'$network': {
						'$network': {
							slug: decodeURIComponent(params.networkSlug),
						},
					},
					consensusTimestamp: decodeURIComponent(params.consensusTimestamp),
				},
			},
			logIndex: Number(params.logIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid HederaContractLog selector')

	return { selector }
}
