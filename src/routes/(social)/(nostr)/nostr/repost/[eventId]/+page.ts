import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	return {
		selector: {
			eventId: decodeURIComponent(params.eventId).toLowerCase(),
		},
	}
}
