import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import Erc4337PaymasterSchema from '$/schema/Erc4337Paymaster.ts'
import NetworkSchema from '$/schema/EvmNetwork.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = NetworkSchema.id({ caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } })
	if ($network instanceof arktype.errors) error(404, 'Invalid network')
	const raw = params.address.startsWith('0x') ?
		params.address
	:
		`0x${params.address}`
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid address')
		const entityId = Erc4337PaymasterSchema.id({
			$network,
			address,
		})
		if (entityId instanceof arktype.errors) error(404, 'Invalid paymaster')
	return {
		entityId,
	}
}
