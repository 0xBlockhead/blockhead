// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import HederaToken_TimestampSchema from '$/schema/HederaToken_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import TronToken_TimestampSchema from '$/schema/TronToken_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	const hederaTokenTimestampTokenTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Hedera'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const hederaTokenTimestampTokenTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			HederaToken_TimestampSchema,
			{
				$token: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'TokenTimestampMsSource'
		)
		if ((!(hederaTokenTimestampTokenTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.HederaToken_Timestamp,
				selectorName: 'TokenTimestampMsSource',
				selector: hederaTokenTimestampTokenTimestampMsSourceSelector,
			} as const
	})()

	const tronTokenTimestampTokenTimestampMsSourceSelectorCandidate = (() => {
		if (!(
			parentData.projectionNetwork.namespace === 'Tron'
			&& matchNonNegativeInteger(params.timestampMs)
			&& matchStringSegment(params.source)
		))
			return

		const tronTokenTimestampTokenTimestampMsSourceSelector = parseRouteEntitySelector(
			schema,
			TronToken_TimestampSchema,
			{
				$token: parentData.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			},
			'TokenTimestampMsSource'
		)
		if ((!(tronTokenTimestampTokenTimestampMsSourceSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.TronToken_Timestamp,
				selectorName: 'TokenTimestampMsSource',
				selector: tronTokenTimestampTokenTimestampMsSourceSelector,
			} as const
	})()

	const routeCandidates = [
		hederaTokenTimestampTokenTimestampMsSourceSelectorCandidate,
		tronTokenTimestampTokenTimestampMsSourceSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	return routeCandidates[0]
}
