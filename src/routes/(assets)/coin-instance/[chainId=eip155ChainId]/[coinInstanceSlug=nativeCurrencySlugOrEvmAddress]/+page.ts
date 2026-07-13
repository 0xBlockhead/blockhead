// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchNativeCurrencySlug } from '$/params/nativeCurrencySlug.ts'
import { parseEntitySelector, type EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmCoinInstance as EvmCoinInstanceSchema } from '$/schema/EvmCoinInstance.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const selectorMappings: {
		entityType: EntityType
		selector: EntitySelector<typeof schema, EntityType>
	}[] = []

	if (matchEip155ChainId(params.chainId) && matchNativeCurrencySlug(params.coinInstanceSlug)) {
		const evmCoinInstanceNetworkTypeSelector = parseEntitySelector(
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
			}
		)
		if (!(evmCoinInstanceNetworkTypeSelector instanceof arktype.errors) && evmCoinInstanceNetworkTypeSelector.type === 'NativeCurrency')
			selectorMappings.push({ entityType: EntityType.EvmCoinInstance, selector: evmCoinInstanceNetworkTypeSelector })
	}

	if (matchEvmAddress(params.coinInstanceSlug) && matchEip155ChainId(params.chainId)) {
		const evmCoinInstanceNetworkTypeContractSelector = parseEntitySelector(
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
			}
		)
		if (!(evmCoinInstanceNetworkTypeContractSelector instanceof arktype.errors) && evmCoinInstanceNetworkTypeContractSelector.type === 'Erc20Token')
			selectorMappings.push({ entityType: EntityType.EvmCoinInstance, selector: evmCoinInstanceNetworkTypeContractSelector })
	}

	if (selectorMappings.length === 0) error(404, 'Route selector not applicable')
	if (selectorMappings.length > 1) error(500, 'Route selector is ambiguous')
	const selectorMapping = selectorMappings[0]

	return { selector: selectorMapping.selector, selectorMapping, selectorMappings }
}
