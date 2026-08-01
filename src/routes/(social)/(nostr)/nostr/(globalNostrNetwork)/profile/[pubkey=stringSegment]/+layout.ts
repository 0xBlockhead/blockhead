// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NostrProfileSchema from '$/schema/NostrProfile.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.pubkey)))
		error(404, 'Route mapping not applicable')

	const nostrProfileCanonicalPubkeySelector = parseEntitySelector(
		schema,
		NostrProfileSchema,
		{
			pubkey: params.pubkey,
		},
		'CanonicalPubkey'
	)
	if (nostrProfileCanonicalPubkeySelector instanceof arktype.errors)
		error(404, 'Invalid NostrProfile selector')

	return {
		selector: nostrProfileCanonicalPubkeySelector,
	}
}
