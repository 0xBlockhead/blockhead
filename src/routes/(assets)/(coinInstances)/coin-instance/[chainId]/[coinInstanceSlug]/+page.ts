import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import CoinInstanceSchema, { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import NetworkSchema from '$/schema/EvmNetwork.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = NetworkSchema.id({ caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } })
	if ($network instanceof arktype.errors) error(404, 'Invalid network')

	if (params.coinInstanceSlug === 'native') {
		const entitySelector = CoinInstanceSchema.id({
			$network,
			type: CoinInstanceType.NativeCurrency,
		})
		if (entitySelector instanceof arktype.errors) error(404, 'Invalid native coin deployment')
		return { entitySelector }
	}

	const raw = (
		params.coinInstanceSlug.startsWith('0x') ?
			params.coinInstanceSlug
		:
			`0x${params.coinInstanceSlug}`
	)
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid token contract address')

	const entitySelector = CoinInstanceSchema.id({
		$network,
		type: CoinInstanceType.Erc20Token,
		$contract: {
			$network,
			address,
		},
	})
	if (entitySelector instanceof arktype.errors) error(404, 'Invalid coin deployment')

	return { entitySelector }
}
