// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CoinBridgeCapabilitySchema from '$/schema/CoinBridgeCapability.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const coinBridgeCapabilitySelector = parseEntitySelector(
		schema,
		CoinBridgeCapabilitySchema,
		{
			$fromInstance: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.fromChainId,
					},
				},
				type: (
				params.fromCoinInstanceSlug === 'native' ?
					'NativeCurrency'
				:
					params.fromCoinInstanceSlug
				),
			},
			$toInstance: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.toChainId,
					},
				},
				type: (
				params.toCoinInstanceSlug === 'native' ?
					'NativeCurrency'
				:
					params.toCoinInstanceSlug
				),
			},
			toolKey: decodeURIComponent(params.toolKey),
		}
	)
	if (coinBridgeCapabilitySelector instanceof arktype.errors) error(404, 'Invalid CoinBridgeCapability selector')

	return {
		selector: coinBridgeCapabilitySelector,
	}
}
