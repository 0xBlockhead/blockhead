// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleSignedRef_Timestamp,
	labels: {
		singular: 'radicle signed ref timestamp',
		plural: 'radicle signed ref observations',
	},
})({
	$signedRef: {
		label: 'signed ref',
		entityType: EntityType.RadicleSignedRef,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		label: 'target object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signatureStatus: {
		label: 'signature status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectAvailable: {
		label: 'object available',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegateThresholdMet: {
		label: 'delegate threshold met',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
		label: 'error',
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
