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
		label: 'Request hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	requestHash: {
		label: 'Request hash',
		primitiveType: ZeroExHex,
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
	$registration: {
		label: 'Registration',
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validatorAddress: {
		label: 'Validator address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestUri: {
		label: 'Request URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	response: {
		label: 'Response',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseUri: {
		label: 'Response URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHashAlgorithm: {
		label: 'Response hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responseHash: {
		label: 'Response hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tag: {
		label: 'Tag',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastUpdate: {
		label: 'Last update',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'Transaction hash',
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
