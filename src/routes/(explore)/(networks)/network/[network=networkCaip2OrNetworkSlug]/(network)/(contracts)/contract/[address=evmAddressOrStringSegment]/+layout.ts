// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import CosmosContractSchema from '$/schema/CosmosContract.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmContractSchema from '$/schema/EvmContract.ts'
import HederaContractSchema from '$/schema/HederaContract.ts'
import { schema } from '$/schema/index.ts'
import NearContractSchema from '$/schema/NearContract.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.EvmContract
			readonly selectorName: 'EvmNetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.EvmContract,
				'EvmNetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.CosmosContract
			readonly selectorName: 'NetworkAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CosmosContract,
				'NetworkAddress'
			>
		}
		| {
			readonly entityType: EntityType.HederaContract
			readonly selectorName: 'NetworkContractId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaContract,
				'NetworkContractId'
			>
		}
		| {
			readonly entityType: EntityType.NearContract
			readonly selectorName: 'NetworkAccountId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.NearContract,
				'NetworkAccountId'
			>
		}
	)[] = []

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
			)
			&& parentData.projectionNetwork.namespace === 'Evm'
		)
		&& matchEvmAddress(params.address)
	) {
		const evmContractEvmNetworkAddressSelector = parseEntitySelector(
			schema,
			EvmContractSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'EvmNetworkAddress'
		)
		if (!(evmContractEvmNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.EvmContract,
				selectorName: 'EvmNetworkAddress',
				selector: evmContractEvmNetworkAddressSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
			)
			&& parentData.projectionNetwork.namespace === 'Cosmos'
		)
		&& matchStringSegment(params.address)
	) {
		const cosmosContractNetworkAddressSelector = parseEntitySelector(
			schema,
			CosmosContractSchema,
			{
				$network: parentData.selector,
				address: params.address,
			},
			'NetworkAddress'
		)
		if (!(cosmosContractNetworkAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CosmosContract,
				selectorName: 'NetworkAddress',
				selector: cosmosContractNetworkAddressSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Hedera' && matchStringSegment(params.address)) {
		const hederaContractNetworkContractIdSelector = parseEntitySelector(
			schema,
			HederaContractSchema,
			{
				$network: parentData.selector,
				contractId: params.address,
			},
			'NetworkContractId'
		)
		if (!(hederaContractNetworkContractIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaContract,
				selectorName: 'NetworkContractId',
				selector: hederaContractNetworkContractIdSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.address)) {
		const nearContractNetworkAccountIdSelector = parseEntitySelector(
			schema,
			NearContractSchema,
			{
				$network: parentData.selector,
				accountId: params.address,
			},
			'NetworkAccountId'
		)
		if (!(nearContractNetworkAccountIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.NearContract,
				selectorName: 'NetworkAccountId',
				selector: nearContractNetworkAccountIdSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
