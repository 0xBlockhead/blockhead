import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/NearAccessKey_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$accessKey': {
				'$account': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
					accountId: decodeURIComponent(params.accountId),
				},
				publicKey: decodeURIComponent(params.publicKey),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid NearAccessKey_Timestamp selector')

	return { selector }
}
