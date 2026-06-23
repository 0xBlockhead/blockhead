import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum RoyaltyRight_TimestampSelector {
	TargetKeyRightKeyTimestampMsSource = 'targetKey+rightKey+timestampMs+source',
}
export default {
	entityType: EntityType.RoyaltyRight_Timestamp,
	label: 'royalty right timestamp',
	labelPlural: 'royalty right observations',
	selectors: [
		{
			name: RoyaltyRight_TimestampSelector.TargetKeyRightKeyTimestampMsSource,
			fields: [
				'targetKey',
				'rightKey',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: 'targetKey',
			label: 'target key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rightKey',
			label: 'right key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sourceKind',
			label: 'source kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$collection',
			label: 'collection',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NftCollection,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$token',
			label: 'token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NftToken,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'receiverSelector',
			label: 'receiver selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'basisPoints',
			label: 'basis points',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'calculationKind',
			label: 'calculation kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'salePriceDenominationPolicy',
			label: 'sale price denomination policy',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'enforcementKind',
			label: 'enforcement kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateKind',
			label: 'ledger coordinate kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateValue',
			label: 'ledger coordinate value',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contractAddress',
			label: 'contract address',
			description: 'The contract address on its network.',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
