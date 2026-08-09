// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import HederaToken_TimestampSchema from '$/schema/HederaToken_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import TronToken_TimestampSchema from '$/schema/TronToken_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.HederaToken_Timestamp
			readonly selectorName: 'TokenTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HederaToken_Timestamp,
				'TokenTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.TronToken_Timestamp
			readonly selectorName: 'TokenTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.TronToken_Timestamp,
				'TokenTimestampMsSource'
			>
		}
	)[] = []

	if (
		parentData.projectionNetwork.namespace === 'Hedera'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const hederaTokenTimestampTokenTimestampMsSourceSelector = parseEntitySelector(
			schema,
			HederaToken_TimestampSchema,
			{
				$token: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'TokenTimestampMsSource'
		)
		if (!(hederaTokenTimestampTokenTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HederaToken_Timestamp,
				selectorName: 'TokenTimestampMsSource',
				selector: hederaTokenTimestampTokenTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Tron'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const tronTokenTimestampTokenTimestampMsSourceSelector = parseEntitySelector(
			schema,
			TronToken_TimestampSchema,
			{
				$token: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'TokenTimestampMsSource'
		)
		if (!(tronTokenTimestampTokenTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.TronToken_Timestamp,
				selectorName: 'TokenTimestampMsSource',
				selector: tronTokenTimestampTokenTimestampMsSourceSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
