import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import EvmContract from '$/schema/EvmContract.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmContractVerificationSelector {
	EvmContract = 'evmContract',
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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'match',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'creationMatch',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'runtimeMatch',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'verifiedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: 'matchId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: '$compilation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractCompilation,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
		{
			name: '$sourceBundle',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContractSourceBundle,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Sourcify_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
