import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'

export enum EvmNetworkBridgeSelector {
	FromToUrl = 'fromToUrl',
}

export default {
	entityType: EntityType.EvmNetworkBridge,

	label: 'Bridge',
	labelPlural: 'Bridges',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$toNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'url',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'relationshipType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
