// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EvmProtocolSchema from '$/schema/EvmProtocol.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const evmProtocolScopeSelector = parseEntitySelector(
		schema,
		EvmProtocolSchema,
		{
			scope: 'EvmProtocol',
		}
	)
	if (evmProtocolScopeSelector instanceof arktype.errors) error(404, 'Invalid EvmProtocol selector')

	return {
		selector: evmProtocolScopeSelector,
	}
}
