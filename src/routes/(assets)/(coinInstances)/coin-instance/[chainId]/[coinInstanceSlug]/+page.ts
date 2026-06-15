import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const $network = { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } }

	if (params.coinInstanceSlug === 'native') {
		return {
			entitySelector: {
				$network,
				type: CoinInstanceType.NativeCurrency,
			},
		}
	}

	const raw = (
		params.coinInstanceSlug.startsWith('0x') ?
			params.coinInstanceSlug
		:
			`0x${params.coinInstanceSlug}`
	)
	const address = EvmAddress(raw)
	if (address instanceof arktype.errors) error(404, 'Invalid token contract address')

	return {
		entitySelector: {
			$network,
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network,
				address,
			},
		},
	}
}
