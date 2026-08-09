// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import KaspaAddressSchema from '$/schema/KaspaAddress.ts'
import SuiAccountSchema from '$/schema/SuiAccount.ts'
import TezosAccountSchema from '$/schema/TezosAccount.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.SuiAccount
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.SuiAccount,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.TezosAccount
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TezosAccount,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.KaspaAddress
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.KaspaAddress,
				'NetworkAddress'
			>
		}
	)[] = []

	if (parentData.projectionNetwork.namespace === 'Sui' && matchStringSegment(params.address)) {
		const suiAccountNetworkAddressSelector = parseEntitySelector(
			schema,
			SuiAccountSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'NetworkAddress'
		)
		if (!(suiAccountNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.SuiAccount,
				selectorName: 'NetworkAddress',
				selector: suiAccountNetworkAddressSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Tezos' && matchStringSegment(params.address)) {
		const tezosAccountNetworkAddressSelector = parseEntitySelector(
			schema,
			TezosAccountSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'NetworkAddress'
		)
		if (!(tezosAccountNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TezosAccount,
				selectorName: 'NetworkAddress',
				selector: tezosAccountNetworkAddressSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Kaspa' && matchStringSegment(params.address)) {
		const kaspaAddressNetworkAddressSelector = parseEntitySelector(
			schema,
			KaspaAddressSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'NetworkAddress'
		)
		if (!(kaspaAddressNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.KaspaAddress,
				selectorName: 'NetworkAddress',
				selector: kaspaAddressNetworkAddressSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
