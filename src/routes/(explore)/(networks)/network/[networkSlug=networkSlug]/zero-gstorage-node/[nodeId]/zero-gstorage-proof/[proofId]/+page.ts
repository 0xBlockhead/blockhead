import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/ZeroGStorageProof.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$storageNode': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				nodeId: decodeURIComponent(params.nodeId),
			},
			proofId: decodeURIComponent(params.proofId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ZeroGStorageProof selector')

	return { selector }
}
