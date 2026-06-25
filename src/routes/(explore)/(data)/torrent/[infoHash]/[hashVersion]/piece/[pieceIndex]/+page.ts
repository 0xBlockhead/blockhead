import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BitTorrentPiece.ts'
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
			pieceIndex: decodeURIComponent(params.pieceIndex),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BitTorrentPiece selector')

	return { selector }
}
