// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const nearRpcJsonRpcSources = [
	Source.NearRpc_JsonRpc,
] as const

export default entity({
	entityType: EntityType.NearValidator_Timestamp,
	labels: {
		singular: 'near validator timestamp',
		plural: 'near validator observations',
	},
})({
	$validator: {
		entityType: EntityType.NearValidator,
		cardinality: EntityFieldCardinality.One,
	},
	epochId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	epochHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	epochStartHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	validatorSetRole: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	publicKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	stakeYoctoNear: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	isSlashed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	expectedBlocks: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	producedBlocks: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	expectedChunks: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	producedChunks: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	shards: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.Many,
	},
	kickoutReason: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ValidatorEpochIdSource: [
			'$validator',
			'epochId',
			'source',
		],
	},
})
