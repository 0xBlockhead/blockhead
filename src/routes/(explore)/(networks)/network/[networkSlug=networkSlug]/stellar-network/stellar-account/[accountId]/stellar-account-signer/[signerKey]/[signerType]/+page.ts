import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/StellarAccountSigner.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$account': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				accountId: decodeURIComponent(params.accountId),
			},
			signerKey: decodeURIComponent(params.signerKey),
			signerType: decodeURIComponent(params.signerType),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid StellarAccountSigner selector')

	return { selector }
}
