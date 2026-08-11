import { redirect } from '@sveltejs/kit'

import type { PageLoad } from './$types'
import { entityHrefFromSearchInput } from './entitySearch.ts'


export const load: PageLoad = ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? ''
	const entityHref = entityHrefFromSearchInput(query)

	if (entityHref)
		redirect(303, entityHref)

	return {
		query,
	}
}
