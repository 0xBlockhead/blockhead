// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmContractVerificationSelector {
	EvmContract = 'EvmContract',
}
export const EvmContractVerification = entity({
	entityType: EntityType.EvmContractVerification,
	labels: {
		singular: 'EVM contract verification',
		plural: 'EVM contract verifications',
	},
})({
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	match: {
		label: 'Match',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	creationMatch: {
		label: 'Creation match',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	runtimeMatch: {
		label: 'Runtime match',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAtMs: {
		label: 'Verified at',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	matchId: {
		label: 'Match ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$compilation: {
		label: 'Compilation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContractCompilation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sourceBundle: {
		label: 'Source bundle',
		type: EntityFieldType.EntityReference,
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
