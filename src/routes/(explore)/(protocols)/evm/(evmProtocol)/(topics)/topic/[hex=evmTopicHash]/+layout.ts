// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmTopicHash } from '$/params/evmTopicHash.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmTopicSchema from '$/schema/EvmTopic.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchEvmTopicHash(params.hex)))
		error(404, 'Route mapping not applicable')

	const evmTopicHexSelector = parseEntitySelector(
		schema,
		EvmTopicSchema,
		{
			hex: params.hex,
		},
		'Hex'
	)
	if (evmTopicHexSelector instanceof arktype.errors)
		error(404, 'Invalid EvmTopic selector')

	return {
		selector: evmTopicHexSelector,
	}
}
