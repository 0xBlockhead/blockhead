import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const feedUrl = decodeURIComponent(params.feedKey).trim()
	const guid = decodeURIComponent(params.guid).trim()
	return {
		selector: {
			feedUrl,
			guid,
		},
	}
}
