import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BitTorrentAnnounce_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$torrent': {
				infoHash: decodeURIComponent(params.infoHash),
				hashVersion: decodeURIComponent(params.hashVersion),
			},
			'$tracker': {
				trackerUrl: decodeURIComponent(params.trackerUrl),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BitTorrentAnnounce_Timestamp selector')

	return { selector }
}
