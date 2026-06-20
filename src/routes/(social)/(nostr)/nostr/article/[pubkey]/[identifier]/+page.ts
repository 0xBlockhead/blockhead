import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	return {
		selector: {
			kind: 30023,
			pubkey: decodeURIComponent(params.pubkey).toLowerCase(),
			identifier: decodeURIComponent(params.identifier),
		},
	}
}
