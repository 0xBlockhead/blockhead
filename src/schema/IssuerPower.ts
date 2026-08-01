// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	powerKind: {
		label: 'power kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actorKey: {
		label: 'actor key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actorSelector: {
		label: 'actor selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateKind: {
		label: 'ledger coordinate kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateValue: {
		label: 'ledger coordinate value',
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
