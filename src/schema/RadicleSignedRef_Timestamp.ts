// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleSignedRef_TimestampSelector {
	SignedRefTimestampMsSource = 'SignedRefTimestampMsSource',
}
export const RadicleSignedRef_Timestamp = entity({
	entityType: EntityType.RadicleSignedRef_Timestamp,
	labels: {
		singular: 'radicle signed ref timestamp',
		plural: 'radicle signed ref observations',
	},
})({
	$signedRef: {
		label: 'signed ref',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RadicleSignedRef,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		label: 'target object ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signatureStatus: {
		label: 'signature status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectAvailable: {
		label: 'object available',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegateThresholdMet: {
		label: 'delegate threshold met',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SignedRefTimestampMsSource: [
			'$signedRef',
			'timestampMs',
			'source',
		],
	},
})
