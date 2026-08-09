// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import HyperliquidAccount_TimestampSchema from '$/schema/HyperliquidAccount_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import NearAccount_TimestampSchema from '$/schema/NearAccount_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const routeCandidates: (
		| {
			readonly entityType: EntityType.HyperliquidAccount_Timestamp
			readonly selectorName: 'AccountTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.HyperliquidAccount_Timestamp,
				'AccountTimestampMsSource'
			>
		}
		| {
			readonly entityType: EntityType.NearAccount_Timestamp
			readonly selectorName: 'AccountTimestampMsSource'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.NearAccount_Timestamp,
				'AccountTimestampMsSource'
			>
		}
	)[] = []

	if (
		parentData.projectionNetwork.namespace === 'Hyperliquid'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const hyperliquidAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
			schema,
			HyperliquidAccount_TimestampSchema,
			{
				$account: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if (!(hyperliquidAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.HyperliquidAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: hyperliquidAccountTimestampAccountTimestampMsSourceSelector,
			})
	}

	if (
		parentData.projectionNetwork.namespace === 'Near'
		&& matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
	) {
		const nearAccountTimestampAccountTimestampMsSourceSelector = parseEntitySelector(
			schema,
			NearAccount_TimestampSchema,
			{
				$account: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'AccountTimestampMsSource'
		)
		if (!(nearAccountTimestampAccountTimestampMsSourceSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.NearAccount_Timestamp,
				selectorName: 'AccountTimestampMsSource',
				selector: nearAccountTimestampAccountTimestampMsSourceSelector,
			})
	}

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
