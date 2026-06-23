import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/HederaAllowance.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$owner': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				accountId: decodeURIComponent(params.accountId),
			},
			'$spender': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				accountId: decodeURIComponent(params.accountId),
			},
			allowanceKind: decodeURIComponent(params.allowanceKind),
			tokenId: decodeURIComponent(params.tokenId),
			serialNumber: decodeURIComponent(params.serialNumber),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid HederaAllowance selector')

	return { selector }
}
