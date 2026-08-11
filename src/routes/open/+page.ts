import { redirect } from '@sveltejs/kit'

import type { PageLoad } from './$types'
import { entityHrefFromSearchInput, evmHashHrefFromCoordinates } from './entitySearch.ts'


export const load: PageLoad = ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? ''
	const entityHref = (
		entityHrefFromSearchInput(query)
		?? evmHashHrefFromCoordinates({
			query,
			networkCaip2: url.searchParams.get('network'),
			entityKind: url.searchParams.get('kind'),
		})
	)

	if (entityHref)
		redirect(303, entityHref)

	return {
		query,
	}
}
