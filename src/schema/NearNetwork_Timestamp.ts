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
	entityType: EntityType.NearNetwork_Timestamp,
	labels: {
		singular: 'near network timestamp',
		plural: 'near network observations',
	},
})({
	$network: {
		entityType: EntityType.NearNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	headHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	headHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	epochId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
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
	chunkCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	gasPriceYoctoNear: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	currentValidatorCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	nextValidatorCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	currentProposalCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	protocolVersion: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	latestProtocolVersion: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	nodeVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	syncing: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
})({
	selectors: {
		NetworkTimestampMsSource: [
			'$network',
			'timestampMs',
			'source',
		],
	},
})
