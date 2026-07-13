// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { parseEntitySelector, type EntitySelector } from '$/schema/$schema.ts'
import { BeaconValidator as BeaconValidatorSchema } from '$/schema/BeaconValidator.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { SolanaValidator as SolanaValidatorSchema } from '$/schema/SolanaValidator.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const projectionNetwork = (Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value)
	if (projectionNetwork == null) error(404, 'Network projection context not found')

	const selectorMappings: {
		entityType: EntityType
		selector: EntitySelector<typeof schema, EntityType>
	}[] = []

	if ((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')) && matchNonNegativeInteger(params.validatorId)) {
		const beaconValidatorNetworkIndexInNetworkSelector = parseEntitySelector(
			schema,
			BeaconValidatorSchema,
			{
				$network: parentData.selector,
				indexInNetwork: Number(params.validatorId),
			}
		)
		if (!(beaconValidatorNetworkIndexInNetworkSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.BeaconValidator, selector: beaconValidatorNetworkIndexInNetworkSelector })
	}

	if ((projectionNetwork.executionModels !== undefined && projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'SolanaRuntime')) && matchSolanaPubkey(params.validatorId)) {
		const solanaValidatorNetworkVotePubkeySelector = parseEntitySelector(
			schema,
			SolanaValidatorSchema,
			{
				$network: parentData.selector,
				votePubkey: params.validatorId,
			}
		)
		if (!(solanaValidatorNetworkVotePubkeySelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.SolanaValidator, selector: solanaValidatorNetworkVotePubkeySelector })
	}

	if (selectorMappings.length === 0) error(404, 'Route selector not applicable')
	if (selectorMappings.length > 1) error(500, 'Route selector is ambiguous')
	const selectorMapping = selectorMappings[0]

	return { selector: selectorMapping.selector, selectorMapping, selectorMappings }
}
