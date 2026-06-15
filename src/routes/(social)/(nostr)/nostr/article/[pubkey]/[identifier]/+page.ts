import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	return {
		entitySelector: {
			pubkey: decodeURIComponent(params.pubkey).trim().toLowerCase(),
			identifier: decodeURIComponent(params.identifier).trim(),
		},
	}
}
