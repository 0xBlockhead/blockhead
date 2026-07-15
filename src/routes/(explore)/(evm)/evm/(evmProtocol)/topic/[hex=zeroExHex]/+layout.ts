// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { EvmTopic as EvmTopicSchema } from '$/schema/EvmTopic.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchZeroExHex(params.hex))) error(404, 'Route mapping not applicable')

	const evmTopicHexSelector = parseEntitySelector(
		schema,
		EvmTopicSchema,
		{
			hex: params.hex,
		}
	)
	if (evmTopicHexSelector instanceof arktype.errors) error(404, 'Invalid EvmTopic selector')

	return {
		selector: evmTopicHexSelector,
	}
}
