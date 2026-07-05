// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleSignedRef_TimestampSelector {
	SignedRefTimestampMsSource = 'SignedRefTimestampMsSource',
}
export default {
	entityType: EntityType.RadicleSignedRef_Timestamp,
	label: 'radicle signed ref timestamp',
	labelPlural: 'radicle signed ref observations',
	selectors: [
		{
			name: RadicleSignedRef_TimestampSelector.SignedRefTimestampMsSource,
			fields: [
				'$signedRef',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$signedRef',
				label: 'signed ref',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.RadicleSignedRef,
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
				name: 'targetObjectId',
				label: 'target object ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'signatureStatus',
				label: 'signature status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'objectAvailable',
				label: 'object available',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'delegateThresholdMet',
				label: 'delegate threshold met',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'error',
				label: 'error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
