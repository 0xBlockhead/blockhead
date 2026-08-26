// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import KaspaAddressSchema from '$/schema/KaspaAddress.ts'
import SuiAccountSchema from '$/schema/SuiAccount.ts'
import TezosAccountSchema from '$/schema/TezosAccount.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const suiAccountNetworkAddressSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Sui' && matchStringSegment(params.address)))
			return

		const suiAccountNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			SuiAccountSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'NetworkAddress'
		)
		if ((!(suiAccountNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.SuiAccount,
				selectorName: 'NetworkAddress',
				selector: suiAccountNetworkAddressSelector,
			} as const
	})()

	const tezosAccountNetworkAddressSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Tezos' && matchStringSegment(params.address)))
			return

		const tezosAccountNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			TezosAccountSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'NetworkAddress'
		)
		if ((!(tezosAccountNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TezosAccount,
				selectorName: 'NetworkAddress',
				selector: tezosAccountNetworkAddressSelector,
			} as const
	})()

	const kaspaAddressNetworkAddressSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Kaspa' && matchStringSegment(params.address)))
			return

		const kaspaAddressNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			KaspaAddressSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'NetworkAddress'
		)
		if ((!(kaspaAddressNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.KaspaAddress,
				selectorName: 'NetworkAddress',
				selector: kaspaAddressNetworkAddressSelector,
			} as const
	})()

	const routeCandidates = [
		suiAccountNetworkAddressSelectorCandidate,
		tezosAccountNetworkAddressSelectorCandidate,
		kaspaAddressNetworkAddressSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
