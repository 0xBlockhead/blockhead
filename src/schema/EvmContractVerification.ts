// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmContractVerificationSelector {
	EvmContract = 'EvmContract',
}
export default {
	entityType: EntityType.EvmContractVerification,
	label: 'EVM contract verification',
	labelPlural: 'EVM contract verifications',
	selectors: [
		{
			name: EvmContractVerificationSelector.EvmContract,
			fields: [
				'$contract',
			],
		},
	],
	fields: [
		{
			name: '$contract',
			label: 'Contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'match',
			label: 'Match',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'creationMatch',
			label: 'Creation match',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'runtimeMatch',
			label: 'Runtime match',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedAtMs',
			label: 'Verified at',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'matchId',
			label: 'Match ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$compilation',
			label: 'Compilation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractCompilation,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$sourceBundle',
			label: 'Source bundle',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractSourceBundle,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
