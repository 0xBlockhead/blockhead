import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NostrArticleSchema from '$/schema/NostrArticle.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const entityId = NostrArticleSchema.id({
		pubkey: decodeURIComponent(params.pubkey).trim().toLowerCase(),
		identifier: decodeURIComponent(params.identifier).trim(),
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid Nostr article')
	return { entityId }
}
