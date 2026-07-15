// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum EvmNetworkBridgeSelector {
	FromToUrl = 'FromToUrl',
}
export const EvmNetworkBridge = entity({
	entityType: EntityType.EvmNetworkBridge,
	labels: {
		singular: 'EVM network bridge',
		plural: 'EVM network bridges',
	},
})({
	$fromNetwork: {
		label: 'From network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$toNetwork: {
		label: 'To network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipType: {
		label: 'Relationship type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		FromToUrl: [
			'$fromNetwork',
			'$toNetwork',
			'url',
		],
	},
})
