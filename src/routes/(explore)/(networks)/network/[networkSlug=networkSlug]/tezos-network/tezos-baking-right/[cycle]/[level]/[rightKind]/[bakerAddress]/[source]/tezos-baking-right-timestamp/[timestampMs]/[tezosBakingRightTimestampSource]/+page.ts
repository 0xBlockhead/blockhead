import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/TezosBakingRight_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$right': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				cycle: decodeURIComponent(params.cycle),
				level: decodeURIComponent(params.level),
				rightKind: decodeURIComponent(params.rightKind),
				bakerAddress: decodeURIComponent(params.bakerAddress),
				source: decodeURIComponent(params.source),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.tezosBakingRightTimestampSource),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid TezosBakingRight_Timestamp selector')

	return { selector }
}
