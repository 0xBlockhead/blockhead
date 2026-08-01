// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmContractVerification,
	labels: {
		singular: 'EVM contract verification',
		plural: 'EVM contract verifications',
	},
})({
	$contract: {
		label: 'Contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	match: {
		label: 'Match',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	creationMatch: {
		label: 'Creation match',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	runtimeMatch: {
		label: 'Runtime match',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAtMs: {
		label: 'Verified at',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	matchId: {
		label: 'Match ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$compilation: {
		label: 'Compilation',
		entityType: EntityType.EvmContractCompilation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sourceBundle: {
		label: 'Source bundle',
		entityType: EntityType.EvmContractSourceBundle,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmContract: [
			'$contract',
		],
	},
})
