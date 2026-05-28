import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'

import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import ActorNetworkSchema from '$/schema/ActorNetwork.ts'
import ActorSchema from '$/schema/Actor.ts'
import NetworkSchema from '$/schema/EvmNetwork.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = NetworkSchema.id({
		chainId: evmChainIdFromCaip2RouteParams(params),
	})
	if ($network instanceof arktype.errors) error(404, 'Invalid network')

	const raw = (
		params.address.startsWith('0x') ?
			params.address
		:
			`0x${params.address}`
	)
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid account address')

	const $actor = ActorSchema.id({ address })
	if ($actor instanceof arktype.errors) error(404, 'Invalid account address')

	const entityId = ActorNetworkSchema.id({
		$network,
		$actor,
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid wallet on network')

	return { entityId }
}
