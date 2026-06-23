import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CardanoBlockSelector {
	NetworkHash = '$network+hash',
	NetworkSlot = '$network+slot',
	NetworkBlockNo = '$network+blockNo',
}
export default {
	entityType: EntityType.CardanoBlock,
	label: 'cardano block',
	labelPlural: 'cardano blocks',
	selectors: [
		{
			name: CardanoBlockSelector.NetworkHash,
			fields: [
				'$network',
				'hash',
			],
		},
		{
			name: CardanoBlockSelector.NetworkSlot,
			fields: [
				'$network',
				'slot',
			],
		},
		{
			name: CardanoBlockSelector.NetworkBlockNo,
			fields: [
				'$network',
				'blockNo',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slot',
			label: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockNo',
			label: 'block no',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'epoch',
			label: 'epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'era',
			label: 'era',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'issuerVkey',
			label: 'issuer vkey',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
