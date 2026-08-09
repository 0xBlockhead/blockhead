// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import GitPackfileSchema from '$/schema/GitPackfile.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchZeroExHex(params.packHash)))
		error(404, 'Route mapping not applicable')

	const gitPackfilePackHashSelector = parseEntitySelector(
		schema,
		GitPackfileSchema,
		{
			packHash: params.packHash,
		},
		'PackHash'
	)
	if (gitPackfilePackHashSelector instanceof arktype.errors)
		error(404, 'Invalid GitPackfile selector')

	return {
		selector: gitPackfilePackHashSelector,
	}
}
