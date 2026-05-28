import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'

import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NetworkSchema from '$/schema/EvmNetwork.ts'
import EvmUserOperationSchema from '$/schema/EvmUserOperation.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = NetworkSchema.id({
		chainId: evmChainIdFromCaip2RouteParams(params),
	})
	if ($network instanceof arktype.errors) error(404, 'Invalid network')
	const entityId = EvmUserOperationSchema.id({
		$network,
		hash: params.userOperationHash.toLowerCase(),
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid user operation')
	return { entityId }
}
