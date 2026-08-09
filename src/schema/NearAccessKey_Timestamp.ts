// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NearAccessKey_Timestamp,
	labels: {
		singular: 'near access key timestamp',
		plural: 'near access key observations',
	},
})({
	$accessKey: {
		entityType: EntityType.NearAccessKey,
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
	blockHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	permission: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	allowanceYoctoNear: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	receiverId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	methodNames: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
})({
	selectors: {
		AccessKeyTimestampMsSource: [
			'$accessKey',
			'timestampMs',
			'source',
		],
	},
})
