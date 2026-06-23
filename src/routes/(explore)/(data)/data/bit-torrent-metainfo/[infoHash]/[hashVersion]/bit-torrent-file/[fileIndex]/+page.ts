import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BitTorrentFile.ts'
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
			fileIndex: decodeURIComponent(params.fileIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BitTorrentFile selector')

	return { selector }
}
