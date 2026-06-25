import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BitTorrentDhtLookup_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			infoHash: decodeURIComponent(params.infoHash),
			observerKey: decodeURIComponent(params.observerKey),
			timestampMs: Number(params.timestampMs),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BitTorrentDhtLookup_Timestamp selector')

	return { selector }
}
