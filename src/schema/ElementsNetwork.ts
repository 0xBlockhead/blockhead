import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ElementsNetworkSelector {
	Network = 'network',
}
export default {
	entityType: EntityType.ElementsNetwork,
	label: 'elements network',
	labelPlural: 'elements networks',
	selectors: [
		{
			name: ElementsNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$settlementNetwork',
			label: 'settlement network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'federationName',
			label: 'federation name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockTimeSeconds',
			label: 'block time seconds',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$nativeAsset',
			label: 'native asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'confidentialTransactionsDefault',
			label: 'confidential transactions default',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$assets',
			label: 'assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
