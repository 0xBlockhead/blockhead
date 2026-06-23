import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Eip8004CrossRegistrationSelector {
	RegistrationFileTargetKindTargetSelectorHashAlgorithmTargetSelectorHash = '$registrationFile+targetKind+targetSelectorHashAlgorithm+targetSelectorHash',
}
export default {
	entityType: EntityType.Eip8004CrossRegistration,
	label: 'eip8004 cross registration',
	labelPlural: 'eip8004 cross registrations',
	selectors: [
		{
			name: Eip8004CrossRegistrationSelector.RegistrationFileTargetKindTargetSelectorHashAlgorithmTargetSelectorHash,
			fields: [
				'$registrationFile',
				'targetKind',
				'targetSelectorHashAlgorithm',
				'targetSelectorHash',
			],
		},
	],
	fields: [
		{
			name: '$registrationFile',
			label: 'registration file',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Eip8004AgentRegistrationFile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetKind',
			label: 'target kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetSelectorHashAlgorithm',
			label: 'target selector hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetSelectorHash',
			label: 'target selector hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetSelector',
			label: 'target selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'evidenceUri',
			label: 'evidence URI',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signature',
			label: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
