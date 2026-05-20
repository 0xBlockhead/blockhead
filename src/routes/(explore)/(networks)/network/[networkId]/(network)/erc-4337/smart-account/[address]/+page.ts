import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import Erc4337SmartAccountSchema from '$/schema/Erc4337SmartAccount.ts'
import NetworkSchema from '$/schema/Network.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'

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
	return {
		entityId: Erc4337SmartAccountSchema.id({
			$network,
			address,
		}),
	}
}
