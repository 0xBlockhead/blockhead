// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchPolkadotAccountId } from '$/params/polkadotAccountId.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { parseEntitySelector, type EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmNetworkAccount as EvmNetworkAccountSchema } from '$/schema/EvmNetworkAccount.ts'
import { schema } from '$/schema/index.ts'
import { PolkadotAccount as PolkadotAccountSchema } from '$/schema/PolkadotAccount.ts'
import { SolanaAccount as SolanaAccountSchema } from '$/schema/SolanaAccount.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	const selectorMappings: {
		entityType: EntityType
		selector: EntitySelector<typeof schema, EntityType>
	}[] = []

	if ((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'PolkadotRuntime')) && matchPolkadotAccountId(params.accountId)) {
		const polkadotAccountNetworkAccountIdSelector = parseEntitySelector(
			schema,
			PolkadotAccountSchema,
			{
				$network: parentData.selector,
				accountId: params.accountId,
			}
		)
		if (!(polkadotAccountNetworkAccountIdSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.PolkadotAccount, selector: polkadotAccountNetworkAccountIdSelector })
	}

	if ((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchEvmAddress(params.accountId)) {
		const evmNetworkAccountEvmNetworkEvmAccountSelector = parseEntitySelector(
			schema,
			EvmNetworkAccountSchema,
			{
				$network: parentData.selector,
				$actor: {
					address: params.accountId,
				},
			}
		)
		if (!(evmNetworkAccountEvmNetworkEvmAccountSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.EvmNetworkAccount, selector: evmNetworkAccountEvmNetworkEvmAccountSelector })
	}

	if ((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')) && matchSolanaPubkey(params.accountId)) {
		const solanaAccountNetworkPubkeySelector = parseEntitySelector(
			schema,
			SolanaAccountSchema,
			{
				$network: parentData.selector,
				pubkey: params.accountId,
			}
		)
		if (!(solanaAccountNetworkPubkeySelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.SolanaAccount, selector: solanaAccountNetworkPubkeySelector })
	}

	if (selectorMappings.length === 0) error(404, 'Route selector not applicable')
	if (selectorMappings.length > 1) error(500, 'Route selector is ambiguous')
	const selectorMapping = selectorMappings[0]

	return { selector: selectorMapping.selector, selectorMapping, selectorMappings }
}
