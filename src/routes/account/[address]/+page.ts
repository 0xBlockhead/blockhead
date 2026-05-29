import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import EvmAccountSchema from '$/schema/EvmAccount.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const raw = (
		params.address.startsWith('0x') ?
			params.address
		:
			`0x${params.address}`
	)
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid account address')

	const entityId = EvmAccountSchema.id({ address })
	if (entityId instanceof arktype.errors) error(404, 'Invalid account')

	return { entityId }
}
