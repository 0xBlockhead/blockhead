import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/HederaTokenTransfer.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$transaction': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				consensusTimestamp: decodeURIComponent(params.consensusTimestamp),
			},
			tokenId: decodeURIComponent(params.tokenId),
			accountId: decodeURIComponent(params.accountId),
			transferIndex: decodeURIComponent(params.transferIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid HederaTokenTransfer selector')

	return { selector }
}
