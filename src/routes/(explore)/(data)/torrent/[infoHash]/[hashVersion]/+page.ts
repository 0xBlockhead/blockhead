import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BitTorrentMetainfo.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			infoHash: decodeURIComponent(params.infoHash),
			hashVersion: decodeURIComponent(params.hashVersion),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BitTorrentMetainfo selector')

	return { selector }
}
