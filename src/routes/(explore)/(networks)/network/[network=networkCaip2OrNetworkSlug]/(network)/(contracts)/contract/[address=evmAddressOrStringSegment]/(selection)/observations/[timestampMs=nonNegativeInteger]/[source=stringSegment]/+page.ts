// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import HederaContract_TimestampSchema from '$/schema/HederaContract_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import NearContract_TimestampSchema from '$/schema/NearContract_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.HederaContract_Timestamp
			readonly selectorName: 'ContractTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaContract_Timestamp,
				'ContractTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.NearContract_Timestamp
			readonly selectorName: 'ContractTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.NearContract_Timestamp,
				'ContractTimestampMsSource'
			>
		}
	)[] = []

	if (
		parentData.projectionNetwork.namespace === 'Hedera'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const hederaContractTimestampContractTimestampMsSourceSelector = parseEntitySelector(
			schema,
			HederaContract_TimestampSchema,
			{
				$contract: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'ContractTimestampMsSource'
		)
		if (!(hederaContractTimestampContractTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaContract_Timestamp,
				selectorName: 'ContractTimestampMsSource',
				selector: hederaContractTimestampContractTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Near'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const nearContractTimestampContractTimestampMsSourceSelector = parseEntitySelector(
			schema,
			NearContract_TimestampSchema,
			{
				$contract: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'ContractTimestampMsSource'
		)
		if (!(nearContractTimestampContractTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.NearContract_Timestamp,
				selectorName: 'ContractTimestampMsSource',
				selector: nearContractTimestampContractTimestampMsSourceSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
