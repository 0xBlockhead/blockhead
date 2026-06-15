import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	return {
		entitySelector: {
			$network: {
				caip2: {
					namespace: params.caip2Namespace,
					reference: params.caip2Reference,
				},
			},
			hash: params.userOperationHash.toLowerCase(),
		},
	}
}
