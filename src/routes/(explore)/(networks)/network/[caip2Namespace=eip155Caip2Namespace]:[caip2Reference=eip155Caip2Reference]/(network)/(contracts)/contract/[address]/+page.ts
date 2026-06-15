import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { EvmAddress } from '$/schema/ZeroExHex.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const raw = params.address.startsWith('0x') ?
		params.address
	:
		`0x${params.address}`
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid contract address')
	return {
		entitySelector: {
			$network: {
				caip2: {
					namespace: params.caip2Namespace,
					reference: params.caip2Reference,
				},
			},
			address,
		},
	}
}
