import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import EvmNetworkAccountSchema from '$/schema/EvmNetworkAccount.ts'
import EvmAccountSchema from '$/schema/EvmAccount.ts'
import NetworkSchema from '$/schema/EvmNetwork.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = NetworkSchema.id({ caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } })
	if ($network instanceof arktype.errors) error(404, 'Invalid network')

	const raw = (
		params.address.startsWith('0x') ?
			params.address
		:
			`0x${params.address}`
	)
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid account address')

	const $actor = EvmAccountSchema.id({ address })
	if ($actor instanceof arktype.errors) error(404, 'Invalid account address')

	const entitySelector = EvmNetworkAccountSchema.id({
		$network,
		$actor,
	})
	if (entitySelector instanceof arktype.errors) error(404, 'Invalid wallet on network')

	return { entitySelector }
}
