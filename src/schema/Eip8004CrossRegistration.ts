// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum Eip8004CrossRegistrationSelector {
	RegistrationFileTargetKindTargetSelectorHashAlgorithmTargetSelectorHash = 'RegistrationFileTargetKindTargetSelectorHashAlgorithmTargetSelectorHash',
}
export default {
	entityType: EntityType.Eip8004CrossRegistration,
	label: 'EIP-8004 cross registration',
	labelPlural: 'EIP-8004 cross registrations',
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
			label: 'Registration file',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Eip8004AgentRegistrationFile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetKind',
			label: 'Target kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetSelectorHashAlgorithm',
			label: 'Target selector hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetSelectorHash',
			label: 'Target selector hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetSelector',
			label: 'Target selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'evidenceUri',
			label: 'Evidence URI',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signature',
			label: 'Signature',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
