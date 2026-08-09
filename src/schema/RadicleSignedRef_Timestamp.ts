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
		entityType: EntityType.RadicleSignedRef,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signatureStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectAvailable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegateThresholdMet: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
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
