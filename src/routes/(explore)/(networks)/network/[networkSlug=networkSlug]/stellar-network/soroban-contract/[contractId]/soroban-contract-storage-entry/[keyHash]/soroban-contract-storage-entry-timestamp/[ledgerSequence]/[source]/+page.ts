import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SorobanContractStorageEntry_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$entry': {
				'$contract': {
					'$network': {
						'$network': {
							slug: decodeURIComponent(params.networkSlug),
						},
					},
					contractId: decodeURIComponent(params.contractId),
				},
				keyHash: decodeURIComponent(params.keyHash),
			},
			ledgerSequence: decodeURIComponent(params.ledgerSequence),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SorobanContractStorageEntry_Timestamp selector')

	return { selector }
}
