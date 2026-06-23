import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/NearContractStorageEntry.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$contract': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				accountId: decodeURIComponent(params.accountId),
			},
			keyBase64: decodeURIComponent(params.keyBase64),
			blockHeight: decodeURIComponent(params.blockHeight),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid NearContractStorageEntry selector')

	return { selector }
}
