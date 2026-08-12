// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CashuMintSchema from '$/schema/CashuMint.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchAbsoluteUrl(params.mintUrl)))
		error(404, 'Route mapping not applicable')

	const cashuMintMintUrlSelector = parseEntitySelector(
		schema,
		CashuMintSchema,
		{
			mintUrl: decodeURIComponent(params.mintUrl),
		},
		'MintUrl'
	)
	if (cashuMintMintUrlSelector instanceof arktype.errors)
		error(404, 'Invalid CashuMint selector')

	return {
		selector: cashuMintMintUrlSelector,
	}
}
