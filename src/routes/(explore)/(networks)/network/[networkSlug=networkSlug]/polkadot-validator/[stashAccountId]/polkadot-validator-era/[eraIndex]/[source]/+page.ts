import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/PolkadotValidator_Era.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$validator': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				stashAccountId: decodeURIComponent(params.stashAccountId),
			},
			eraIndex: decodeURIComponent(params.eraIndex),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid PolkadotValidator_Era selector')

	return { selector }
}
