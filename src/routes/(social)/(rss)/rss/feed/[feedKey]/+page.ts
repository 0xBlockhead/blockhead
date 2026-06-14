import { error } from '@sveltejs/kit'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const feedUrl = decodeURIComponent(params.feedKey).trim()
	try {
		return {
			entitySelector: {
				feedUrl: new URL(feedUrl).href,
			},
		}
	} catch {
		error(404, 'Invalid RSS feed URL')
	}
}
