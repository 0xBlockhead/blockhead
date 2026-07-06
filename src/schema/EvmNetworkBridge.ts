// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum EvmNetworkBridgeSelector {
	FromToUrl = 'FromToUrl',
}
export default {
	entityType: EntityType.EvmNetworkBridge,
	label: 'EVM network bridge',
	labelPlural: 'EVM network bridges',
	selectors: [
		{
			name: EvmNetworkBridgeSelector.FromToUrl,
			fields: [
				'$fromNetwork',
				'$toNetwork',
				'url',
			],
		},
	],
	fields: [
		{
			name: '$fromNetwork',
			label: 'From network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$toNetwork',
			label: 'To network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'url',
			label: 'URL',
			description: 'The URL for the source-domain resource.',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'relationshipType',
			label: 'Relationship type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
