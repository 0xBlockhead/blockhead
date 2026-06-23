import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmNetworkBridgeSelector {
	FromToUrl = 'fromToUrl',
	FromNetworkToNetworkUrl = '$fromNetwork+$toNetwork+url',
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
			label: 'from network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$toNetwork',
			label: 'to network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'url',
			label: 'URL',
			description: 'The URL for the source-domain resource.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'relationshipType',
			label: 'relationship type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
