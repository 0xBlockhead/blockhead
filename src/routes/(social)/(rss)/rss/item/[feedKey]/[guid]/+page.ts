import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const feedUrl = decodeURIComponent(params.feedKey)
	const guid = decodeURIComponent(params.guid)
	return {
		selector: {
			feedUrl,
			guid,
		},
	}
}
