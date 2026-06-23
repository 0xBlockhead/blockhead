import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AiProviderCatalogEntry.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$provider': {
				domain: decodeURIComponent(params.domain),
			},
			catalogKind: decodeURIComponent(params.catalogKind),
			providerEntryId: decodeURIComponent(params.providerEntryId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AiProviderCatalogEntry selector')

	return { selector }
}
