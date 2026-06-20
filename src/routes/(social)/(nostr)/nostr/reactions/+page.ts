import { error } from '@sveltejs/kit'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ url }) => {
	const noteEventId = url.searchParams.get('note')?.toLowerCase()
	if (!noteEventId) return { noteEntitySelector: null }
	return {
		noteEntitySelector: { eventId: noteEventId },
	}
}
