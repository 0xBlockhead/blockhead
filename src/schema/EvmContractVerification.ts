import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmContractVerificationSelector {
	EvmContract = 'evmContract',
	Contract = '$contract',
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
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'match',
			label: 'match',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'creationMatch',
			label: 'creation match',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'runtimeMatch',
			label: 'runtime match',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedAtMs',
			label: 'verified AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'matchId',
			label: 'match ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$compilation',
			label: 'compilation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractCompilation,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$sourceBundle',
			label: 'source bundle',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractSourceBundle,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
