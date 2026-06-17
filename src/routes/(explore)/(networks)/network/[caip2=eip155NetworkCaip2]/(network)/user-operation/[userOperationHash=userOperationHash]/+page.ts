import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	return {
		selector: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.caip2.slice('eip155:'.length),
				},
			},
			hash: params.userOperationHash.toLowerCase(),
		},
	}
}
