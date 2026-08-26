// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import NetworkSchema from '$/schema/Network.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const networkCaip2SelectorCandidate = (() => {
		if (!(matchNetworkCaip2(params.network)))
			return

		const networkCaip2Selector = parseRouteEntitySelector(
			schema,
			NetworkSchema,
			{
				caip2: caip2SelectorValueFromString(params.network),
			},
			'Caip2'
		)
		if ((!(networkCaip2Selector instanceof arktype.errors)))
			return {
				entityType: EntityType.Network,
				selectorName: 'Caip2',
				selector: networkCaip2Selector,
			} as const
	})()

	const networkSlugSelectorCandidate = (() => {
		if (!(matchNetworkSlug(params.network)))
			return

		const networkSlugSelector = parseRouteEntitySelector(
			schema,
			NetworkSchema,
			{
				slug: params.network,
			},
			'Slug'
		)
		if ((!(networkSlugSelector instanceof arktype.errors)))
			return {
				entityType: EntityType.Network,
				selectorName: 'Slug',
				selector: networkSlugSelector,
			} as const
	})()

	const routeCandidates = [
		networkCaip2SelectorCandidate,
		networkSlugSelectorCandidate,
	].filter((candidate) => candidate != null)

	if (routeCandidates.length === 0)
		error(404, 'Route selector not applicable')

	if (routeCandidates.length > 1)
		error(500, 'Route selector is ambiguous')

	const projectionNetwork = (
		Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.network))?.value
		?? Object.getOwnPropertyDescriptor(networkBySlug, params.network)?.value
	)
	if (projectionNetwork == null)
		error(404, 'Network projection context not found')

	return { ...routeCandidates[0], projectionNetwork }
}
