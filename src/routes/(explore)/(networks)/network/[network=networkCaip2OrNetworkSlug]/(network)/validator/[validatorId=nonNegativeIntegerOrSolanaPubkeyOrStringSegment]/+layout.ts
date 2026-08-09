// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import BeaconValidatorSchema from '$/schema/BeaconValidator.ts'
import CosmosValidatorSchema from '$/schema/CosmosValidator.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import NearValidatorSchema from '$/schema/NearValidator.ts'
import SolanaValidatorSchema from '$/schema/SolanaValidator.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.BeaconValidator
			readonly selectorName: 'NetworkIndexInNetwork'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.BeaconValidator,
				'NetworkIndexInNetwork'
			>
		}
		| {
			readonly entityType: EntityType.SolanaValidator
			readonly selectorName: 'NetworkVotePubkey'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.SolanaValidator,
				'NetworkVotePubkey'
			>
		}
		| {
			readonly entityType: EntityType.CosmosValidator
			readonly selectorName: 'NetworkOperatorAddress'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.CosmosValidator,
				'NetworkOperatorAddress'
			>
		}
		| {
			readonly entityType: EntityType.NearValidator
			readonly selectorName: 'NetworkAccountId'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.NearValidator,
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
		&& matchNonNegativeInteger(params.validatorId)
	) {
		const beaconValidatorNetworkIndexInNetworkSelector = parseEntitySelector(
			schema,
			BeaconValidatorSchema,
			{
				$network: parentData.selector,
				indexInNetwork: Number(params.validatorId),
			},
			'NetworkIndexInNetwork'
		)
		if (!(beaconValidatorNetworkIndexInNetworkSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.BeaconValidator,
				selectorName: 'NetworkIndexInNetwork',
				selector: beaconValidatorNetworkIndexInNetworkSelector,
			})
	}

	if (
		(
			(
				parentData.projectionNetwork.executionModels !== undefined
				&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
			)
			&& parentData.projectionNetwork.namespace === 'Solana'
		)
		&& matchSolanaPubkey(params.validatorId)
	) {
		const solanaValidatorNetworkVotePubkeySelector = parseEntitySelector(
			schema,
			SolanaValidatorSchema,
			{
				$network: parentData.selector,
				votePubkey: params.validatorId,
			},
			'NetworkVotePubkey'
		)
		if (!(solanaValidatorNetworkVotePubkeySelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.SolanaValidator,
				selectorName: 'NetworkVotePubkey',
				selector: solanaValidatorNetworkVotePubkeySelector,
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
		&& matchStringSegment(params.validatorId)
	) {
		const cosmosValidatorNetworkOperatorAddressSelector = parseEntitySelector(
			schema,
			CosmosValidatorSchema,
			{
				$network: parentData.selector,
				operatorAddress: params.validatorId,
			},
			'NetworkOperatorAddress'
		)
		if (!(cosmosValidatorNetworkOperatorAddressSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.CosmosValidator,
				selectorName: 'NetworkOperatorAddress',
				selector: cosmosValidatorNetworkOperatorAddressSelector,
			})
	}

	if (parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.validatorId)) {
		const nearValidatorNetworkAccountIdSelector = parseEntitySelector(
			schema,
			NearValidatorSchema,
			{
				$network: parentData.selector,
				accountId: params.validatorId,
			},
			'NetworkAccountId'
		)
		if (!(nearValidatorNetworkAccountIdSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.NearValidator,
				selectorName: 'NetworkAccountId',
				selector: nearValidatorNetworkAccountIdSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
