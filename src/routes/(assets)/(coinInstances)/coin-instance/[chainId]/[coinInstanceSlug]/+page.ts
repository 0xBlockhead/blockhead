import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import CoinInstanceSchema, { CoinInstanceType } from '$/schema/CoinInstance.ts'
import NetworkSchema from '$/schema/Network.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = NetworkSchema.id({
		chainId: Number(params.chainId),
	})
	if ($network instanceof arktype.errors) error(404, 'Invalid network')

	if (params.coinInstanceSlug === 'native') {
		const entityId = CoinInstanceSchema.id({
			$network,
			type: CoinInstanceType.NativeCurrency,
		})
		if (entityId instanceof arktype.errors) error(404, 'Invalid native coin deployment')
		return { entityId }
	}

	const raw = (
		params.coinInstanceSlug.startsWith('0x') ?
			params.coinInstanceSlug
		:
			`0x${params.coinInstanceSlug}`
	)
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid token contract address')

	const entityId = CoinInstanceSchema.id({
		$network,
		type: CoinInstanceType.Erc20Token,
		$contract: {
			$network,
			address,
		},
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid coin deployment')

	return { entityId }
}
