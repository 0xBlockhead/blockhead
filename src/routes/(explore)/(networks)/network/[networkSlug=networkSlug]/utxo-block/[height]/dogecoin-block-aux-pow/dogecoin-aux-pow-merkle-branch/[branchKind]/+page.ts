import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/DogecoinAuxPowMerkleBranch.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$auxPow': {
				'$block': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
					height: Number(params.height),
				},
			},
			branchKind: decodeURIComponent(params.branchKind),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid DogecoinAuxPowMerkleBranch selector')

	return { selector }
}
