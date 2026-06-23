import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/ZeroGDataChunk.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$dataBlob': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				dataRoot: decodeURIComponent(params.dataRoot),
			},
			chunkIndex: decodeURIComponent(params.chunkIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ZeroGDataChunk selector')

	return { selector }
}
