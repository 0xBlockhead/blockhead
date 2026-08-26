// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BeaconValidatorSchema from '$/schema/BeaconValidator.ts'
import CosmosValidatorSchema from '$/schema/CosmosValidator.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import NearValidatorSchema from '$/schema/NearValidator.ts'
import SolanaValidatorSchema from '$/schema/SolanaValidator.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const beaconValidatorNetworkIndexInNetworkSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
				)
				&& parentData.projectionNetwork.namespace === 'Evm'
			)
			&& matchNonNegativeInteger(params.validatorId)
		))
			return

		const beaconValidatorNetworkIndexInNetworkSelector = parseRouteEntitySelector(
			schema,
			BeaconValidatorSchema,
			{
				$network: parentData.selector,
				indexInNetwork: Number(params.validatorId),
			},
			'NetworkIndexInNetwork'
		)
		if ((!(beaconValidatorNetworkIndexInNetworkSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.BeaconValidator,
				selectorName: 'NetworkIndexInNetwork',
				selector: beaconValidatorNetworkIndexInNetworkSelector,
			} as const
	})()

	const solanaValidatorNetworkVotePubkeySelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')
				)
				&& parentData.projectionNetwork.namespace === 'Solana'
			)
			&& matchSolanaPubkey(params.validatorId)
		))
			return

		const solanaValidatorNetworkVotePubkeySelector = parseRouteEntitySelector(
			schema,
			SolanaValidatorSchema,
			{
				$network: parentData.selector,
				votePubkey: params.validatorId,
			},
			'NetworkVotePubkey'
		)
		if ((!(solanaValidatorNetworkVotePubkeySelector instanceof arktype.errors)))
			return {
				entityType: EntityType.SolanaValidator,
				selectorName: 'NetworkVotePubkey',
				selector: solanaValidatorNetworkVotePubkeySelector,
			} as const
	})()

	const cosmosValidatorNetworkOperatorAddressSelectorCandidate = (() => {
		if (!(
			(
				(
					parentData.projectionNetwork.executionModels !== undefined
					&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'CosmosSdk')
				)
				&& parentData.projectionNetwork.namespace === 'Cosmos'
			)
			&& matchStringSegment(params.validatorId)
		))
			return

		const cosmosValidatorNetworkOperatorAddressSelector = parseRouteEntitySelector(
			schema,
			CosmosValidatorSchema,
			{
				$network: parentData.selector,
				operatorAddress: params.validatorId,
			},
			'NetworkOperatorAddress'
		)
		if ((!(cosmosValidatorNetworkOperatorAddressSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.CosmosValidator,
				selectorName: 'NetworkOperatorAddress',
				selector: cosmosValidatorNetworkOperatorAddressSelector,
			} as const
	})()

	const nearValidatorNetworkAccountIdSelectorCandidate = (() => {
		if (!(parentData.projectionNetwork.namespace === 'Near' && matchStringSegment(params.validatorId)))
			return

		const nearValidatorNetworkAccountIdSelector = parseRouteEntitySelector(
			schema,
			NearValidatorSchema,
			{
				$network: parentData.selector,
				accountId: params.validatorId,
			},
			'NetworkAccountId'
		)
		if ((!(nearValidatorNetworkAccountIdSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.NearValidator,
				selectorName: 'NetworkAccountId',
				selector: nearValidatorNetworkAccountIdSelector,
			} as const
	})()

	const routeCandidates = [
		beaconValidatorNetworkIndexInNetworkSelectorCandidate,
		solanaValidatorNetworkVotePubkeySelectorCandidate,
		cosmosValidatorNetworkOperatorAddressSelectorCandidate,
		nearValidatorNetworkAccountIdSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
