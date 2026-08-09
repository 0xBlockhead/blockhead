// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Eip8004Validation_Timestamp,
	labels: {
		singular: 'EIP-8004 validation timestamp',
		plural: 'EIP-8004 validation observations',
	},
})({
	requestHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	requestHash: {
		primitiveType: ZeroExHex,
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
	$registration: {
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validatorAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestUri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	response: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseUri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tag: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastUpdate: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RequestHashAlgorithmRequestHashTimestampMsSource: [
			'requestHashAlgorithm',
			'requestHash',
			'timestampMs',
			'source',
		],
	},
})
