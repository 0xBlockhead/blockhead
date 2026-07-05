// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum UsageRight_TimestampSelector {
	SubjectKeyRightKeyTimestampMsSource = 'SubjectKeyRightKeyTimestampMsSource',
}
export default {
	entityType: EntityType.UsageRight_Timestamp,
	label: 'usage right timestamp',
	labelPlural: 'usage right observations',
	selectors: [
		{
			name: UsageRight_TimestampSelector.SubjectKeyRightKeyTimestampMsSource,
			fields: [
				'subjectKey',
				'rightKey',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: 'subjectKey',
				label: 'subject key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'rightKey',
				label: 'right key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'sourceKind',
				label: 'source kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'rightKind',
				label: 'right kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$object',
				label: 'object',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AssetObject,
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
				name: '$user',
				label: 'user',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Account,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'userSelector',
				label: 'user selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'expiresAt',
				label: 'expires AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ledgerCoordinateKind',
				label: 'ledger coordinate kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ledgerCoordinateValue',
				label: 'ledger coordinate value',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractAddress',
				label: 'contract address',
				description: 'The contract address on its network.',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
