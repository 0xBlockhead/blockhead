// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmTopicSchema from '$/schema/EvmTopic.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmTopicSelector = parseEntitySelector(
		schema,
		EvmTopicSchema,
		{
			hex: decodeURIComponent(params.hex),
		}
	)
	if (evmTopicSelector instanceof arktype.errors) error(404, 'Invalid EvmTopic selector')

	return {
		selector: evmTopicSelector,
	}
}
