// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { networkByCaip2, networkBySlug } from '$/constants/Network.ts'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { parseEntitySelector, type EntitySelectorForSelectorName } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import NetworkSchema from '$/schema/Network.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const routeCandidates: (
		| {
			readonly entityType: EntityType.Network
			readonly selectorName: 'Caip2'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.Network,
				'Caip2'
			>
		}
		| {
			readonly entityType: EntityType.Network
			readonly selectorName: 'Slug'
			readonly selector: EntitySelectorForSelectorName<
				typeof schema,
				EntityType.Network,
				'Slug'
			>
		}
	)[] = []

	if (matchNetworkCaip2(params.network)) {
		const networkCaip2Selector = parseEntitySelector(
			schema,
			NetworkSchema,
			{
				caip2: caip2SelectorValueFromString(params.network),
			},
			'Caip2'
		)
		if (!(networkCaip2Selector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.Network,
				selectorName: 'Caip2',
				selector: networkCaip2Selector,
			})
	}

	if (matchNetworkSlug(params.network)) {
		const networkSlugSelector = parseEntitySelector(
			schema,
			NetworkSchema,
			{
				slug: params.network,
			},
			'Slug'
		)
		if (!(networkSlugSelector instanceof arktype.errors))
			routeCandidates.push({
				entityType: EntityType.Network,
				selectorName: 'Slug',
				selector: networkSlugSelector,
			})
	}

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
