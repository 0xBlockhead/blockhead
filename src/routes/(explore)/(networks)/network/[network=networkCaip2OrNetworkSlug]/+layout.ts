// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { parseEntitySelector, type EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Network as NetworkSchema } from '$/schema/Network.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const selectorMappings: {
		entityType: EntityType
		selectorName: string
		selector: EntitySelector<typeof schema, EntityType>
	}[] = []

	if (matchNetworkCaip2(params.network)) {
		const networkCaip2Selector = parseEntitySelector(
			schema,
			NetworkSchema,
			{
				caip2: caip2SelectorValueFromString(params.network),
			}
		)
		if (!(networkCaip2Selector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.Network, selectorName: 'Caip2', selector: networkCaip2Selector })
	}

	if (matchNetworkSlug(params.network)) {
		const networkSlugSelector = parseEntitySelector(
			schema,
			NetworkSchema,
			{
				slug: params.network,
			}
		)
		if (!(networkSlugSelector instanceof arktype.errors))
			selectorMappings.push({ entityType: EntityType.Network, selectorName: 'Slug', selector: networkSlugSelector })
	}

	if (selectorMappings.length === 0) error(404, 'Route selector not applicable')
	if (selectorMappings.length > 1) error(500, 'Route selector is ambiguous')
	const selectorMapping = selectorMappings[0]

	return { selector: selectorMapping.selector, selectorMapping, selectorMappings }
}
