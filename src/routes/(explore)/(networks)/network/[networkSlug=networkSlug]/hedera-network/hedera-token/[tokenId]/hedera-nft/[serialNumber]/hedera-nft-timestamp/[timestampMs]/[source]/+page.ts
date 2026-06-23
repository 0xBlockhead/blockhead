import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/HederaNft_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$nft': {
				'$token': {
					'$network': {
						'$network': {
							slug: decodeURIComponent(params.networkSlug),
						},
					},
					tokenId: decodeURIComponent(params.tokenId),
				},
				serialNumber: decodeURIComponent(params.serialNumber),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid HederaNft_Timestamp selector')

	return { selector }
}
