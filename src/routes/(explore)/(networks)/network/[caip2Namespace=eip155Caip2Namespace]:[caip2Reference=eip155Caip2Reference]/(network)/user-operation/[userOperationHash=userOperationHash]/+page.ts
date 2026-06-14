import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NetworkSchema from '$/schema/EvmNetwork.ts'
import EvmUserOperationSchema from '$/schema/EvmUserOperation.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = NetworkSchema.id({ caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } })
	if ($network instanceof arktype.errors) error(404, 'Invalid network')
	const entitySelector = EvmUserOperationSchema.id({
		$network,
		hash: params.userOperationHash.toLowerCase(),
	})
	if (entitySelector instanceof arktype.errors) error(404, 'Invalid user operation')
	return { entitySelector }
}
