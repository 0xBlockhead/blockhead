// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CosmosContractSchema from '$/schema/CosmosContract.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmContractSchema from '$/schema/EvmContract.ts'
import HederaContractSchema from '$/schema/HederaContract.ts'
import { schema } from '$/schema/index.ts'
import NearContractSchema from '$/schema/NearContract.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const evmContractEvmNetworkAddressSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
				)
				&& parentData.projectionNetwork.namespace === 'Evm'
			)
			&& matchEvmAddress(params.address)
		))
			return

		const evmContractEvmNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			EvmContractSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'EvmNetworkAddress'
		)
		if ((!(evmContractEvmNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.EvmContract,
				selectorName: 'EvmNetworkAddress',
				selector: evmContractEvmNetworkAddressSelector,
			} as const
	})()

	const cosmosContractNetworkAddressSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
				)
				&& parentData.projectionNetwork.namespace === 'Cosmos'
			)
			&& matchStringSegment(params.address)
		))
			return

		const cosmosContractNetworkAddressSelector = parseRouteEntitySelector(
			schema,
			CosmosContractSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'NetworkAddress'
		)
		if ((!(cosmosContractNetworkAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CosmosContract,
				selectorName: 'NetworkAddress',
				selector: cosmosContractNetworkAddressSelector,
			} as const
	})()

	const hederaContractNetworkContractIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.address)))
			return

		const hederaContractNetworkContractIdSelector = parseRouteEntitySelector(
			schema,
			HederaContractSchema,
			{
				$network: parentData.selector,
				contractId: params.address,
			},
			'NetworkContractId'
		)
		if ((!(hederaContractNetworkContractIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaContract,
				selectorName: 'NetworkContractId',
				selector: hederaContractNetworkContractIdSelector,
			} as const
	})()

	const nearContractNetworkAccountIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.address)))
			return

		const nearContractNetworkAccountIdSelector = parseRouteEntitySelector(
			schema,
			NearContractSchema,
			{
				$network: parentData.selector,
				accountId: params.address,
			},
			'NetworkAccountId'
		)
		if ((!(nearContractNetworkAccountIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.NearContract,
				selectorName: 'NetworkAccountId',
				selector: nearContractNetworkAccountIdSelector,
			} as const
	})()

	const routeCandidates = [
		evmContractEvmNetworkAddressSelectorCandidate,
		cosmosContractNetworkAddressSelectorCandidate,
		hederaContractNetworkContractIdSelectorCandidate,
		nearContractNetworkAccountIdSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
