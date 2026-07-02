// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import NostrArticleSchema from '$/schema/NostrArticle.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const nostrArticleSelector = parseEntitySelector(
		schema,
		NostrArticleSchema,
		{
			kind: 30023,
			pubkey: decodeURIComponent(params.pubkey),
			identifier: decodeURIComponent(params.identifier),
		}
	)
	if (nostrArticleSelector instanceof arktype.errors) error(404, 'Invalid NostrArticle selector')

	return {
		selector: nostrArticleSelector,
	}
}
