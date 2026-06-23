import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/NetworkUpgrade.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$network': {
				slug: decodeURIComponent(params.networkSlug),
			},
			upgradeId: decodeURIComponent(params.upgradeId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid NetworkUpgrade selector')

	return { selector }
}
