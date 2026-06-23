import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AiBenchmark.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			benchmarkUri: decodeURIComponent(params.benchmarkUri),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AiBenchmark selector')

	return { selector }
}
