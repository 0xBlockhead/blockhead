// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IssuerPower,
	labels: {
		singular: 'issuer power',
		plural: 'issuer powers',
	},
})({
	$profile: {
		label: 'profile',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	powerKind: {
		label: 'power kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actorKey: {
		label: 'actor key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actorSelector: {
		label: 'actor selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateKind: {
		label: 'ledger coordinate kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateValue: {
		label: 'ledger coordinate value',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProfilePowerKindActorKeySource: [
			'$profile',
			'powerKind',
			'actorKey',
			'source',
		],
	},
})
