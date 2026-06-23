import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/CardanoCertificate.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$transaction': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				hash: decodeURIComponent(params.hash),
			},
			certificateIndex: decodeURIComponent(params.certificateIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid CardanoCertificate selector')

	return { selector }
}
