import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/SuiPackageUpgrade.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$package': {
				'$network': {
					'$network': {
						slug: decodeURIComponent(params.networkSlug),
					},
				},
				originalPackageId: decodeURIComponent(params.originalPackageId),
			},
			upgradedPackageId: decodeURIComponent(params.upgradedPackageId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SuiPackageUpgrade selector')

	return { selector }
}
