import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadSessionSimulationCall.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			simulationId: decodeURIComponent(params.simulationId),
			callPath: decodeURIComponent(params.callPath),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadSessionSimulationCall selector')

	return { selector }
}
