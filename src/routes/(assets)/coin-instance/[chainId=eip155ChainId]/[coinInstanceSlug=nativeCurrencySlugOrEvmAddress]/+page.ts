// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchNativeCurrencySlug } from '$/params/nativeCurrencySlug.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmCoinInstanceSchema from '$/schema/EvmCoinInstance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const evmCoinInstanceNetworkTypeSelectorCandidate = (() => {
		if (!(matchEip155ChainId(params.chainId) && matchNativeCurrencySlug(params.coinInstanceSlug)))
			return

		const evmCoinInstanceNetworkTypeSelector = parseRouteEntitySelector(
			schema,
			EvmCoinInstanceSchema,
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				type: 'NativeCurrency',
			},
			'NetworkType'
		)
		if ((
			!(evmCoinInstanceNetworkTypeSelector instanceof arktype.errors)
			&& evmCoinInstanceNetworkTypeSelector.type === 'NativeCurrency'
		))
			return {
				entityType: EntityType.EvmCoinInstance,
				selectorName: 'NetworkType',
				selector: evmCoinInstanceNetworkTypeSelector,
			} as const
	})()

	const evmCoinInstanceNetworkTypeContractSelectorCandidate = (() => {
		if (!(matchEvmAddress(params.coinInstanceSlug) && matchEip155ChainId(params.chainId)))
			return

		const evmCoinInstanceNetworkTypeContractSelector = parseRouteEntitySelector(
			schema,
			EvmCoinInstanceSchema,
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: params.chainId,
					},
				},
				type: 'Erc20Token',
				$contract: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.chainId,
						},
					},
					address: params.coinInstanceSlug,
				},
			},
			'NetworkTypeContract'
		)
		if ((
			!(evmCoinInstanceNetworkTypeContractSelector instanceof arktype.errors)
			&& evmCoinInstanceNetworkTypeContractSelector.type === 'Erc20Token'
		))
			return {
				entityType: EntityType.EvmCoinInstance,
				selectorName: 'NetworkTypeContract',
				selector: evmCoinInstanceNetworkTypeContractSelector,
			} as const
	})()

	const routeCandidates = [
		evmCoinInstanceNetworkTypeSelectorCandidate,
		evmCoinInstanceNetworkTypeContractSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
