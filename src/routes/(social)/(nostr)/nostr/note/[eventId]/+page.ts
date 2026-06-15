import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	return {
		entitySelector: {
			eventId: decodeURIComponent(params.eventId).trim().toLowerCase(),
		},
	}
}
