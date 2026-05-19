import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import NetworkSchema from '$/schema/Network.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import EvmAccountAbstractionAddressSchema from '$/schema/EvmAccountAbstractionAddress.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = NetworkSchema.id({
		chainId: Number(params.networkId),
	})
	if ($network instanceof arktype.errors) error(404, 'Invalid network')
	const raw = params.address.startsWith('0x') ?
		params.address
	:
		`0x${params.address}`
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid address')
	const entityId = EvmAccountAbstractionAddressSchema.id({
		$network,
		address,
		role: params.aaRole,
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid account abstraction address')
	return { entityId }
}
