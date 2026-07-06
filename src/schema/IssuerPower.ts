// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IssuerPowerSelector {
	ProfilePowerKindActorKeySource = 'ProfilePowerKindActorKeySource',
}
export default {
	entityType: EntityType.IssuerPower,
	label: 'issuer power',
	labelPlural: 'issuer powers',
	selectors: [
		{
			name: IssuerPowerSelector.ProfilePowerKindActorKeySource,
			fields: [
				'$profile',
				'powerKind',
				'actorKey',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$profile',
			label: 'profile',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RegulatedAssetProfile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'powerKind',
			label: 'power kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actorKey',
			label: 'actor key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actorSelector',
			label: 'actor selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateKind',
			label: 'ledger coordinate kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateValue',
			label: 'ledger coordinate value',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
