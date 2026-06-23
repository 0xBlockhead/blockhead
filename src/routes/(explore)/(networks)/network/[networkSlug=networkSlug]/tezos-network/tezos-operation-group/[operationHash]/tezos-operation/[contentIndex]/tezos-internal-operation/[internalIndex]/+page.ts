import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/TezosInternalOperation.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$parentOperation': {
				'$operationGroup': {
					'$network': {
						'$network': {
							slug: decodeURIComponent(params.networkSlug),
						},
					},
					operationHash: decodeURIComponent(params.operationHash),
				},
				contentIndex: decodeURIComponent(params.contentIndex),
			},
			internalIndex: decodeURIComponent(params.internalIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid TezosInternalOperation selector')

	return { selector }
}
