// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import BeaconValidator_TimestampSchema from '$/schema/BeaconValidator_Timestamp.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import SolanaValidator_TimestampSchema from '$/schema/SolanaValidator_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.BeaconValidator_Timestamp
			readonly selectorName: 'ValidatorSlotSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.BeaconValidator_Timestamp,
				'ValidatorSlotSource'
			>
		}
		| {
			readonly entityType: EntityType.SolanaValidator_Timestamp
			readonly selectorName: 'ValidatorSlotSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.SolanaValidator_Timestamp,
				'ValidatorSlotSource'
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
		&& matchNonNegativeInteger(params.slot)
		&& matchStringSegment(params.source)
	) {
		const beaconValidatorTimestampValidatorSlotSourceSelector = parseEntitySelector(
			schema,
			BeaconValidator_TimestampSchema,
			{
				$validator: parentData.selector,
				slot: Number(params.slot),
				source: params.source,
			},
			'ValidatorSlotSource'
		)
		if (!(beaconValidatorTimestampValidatorSlotSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.BeaconValidator_Timestamp,
				selectorName: 'ValidatorSlotSource',
				selector: beaconValidatorTimestampValidatorSlotSourceSelector,
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
		&& matchStringSegment(params.source)
		&& matchNonNegativeInteger(params.slot)
	) {
		const solanaValidatorTimestampValidatorSlotSourceSelector = parseEntitySelector(
			schema,
			SolanaValidator_TimestampSchema,
			{
				$validator: parentData.selector,
				slot: BigInt(params.slot),
				source: params.source,
			},
			'ValidatorSlotSource'
		)
		if (!(solanaValidatorTimestampValidatorSlotSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.SolanaValidator_Timestamp,
				selectorName: 'ValidatorSlotSource',
				selector: solanaValidatorTimestampValidatorSlotSourceSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
