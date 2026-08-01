// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BnbBeaconToken,
	labels: {
		singular: 'bnb beacon token',
		plural: 'bnb beacon tokens',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.BnbBeaconNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	originalSymbol: {
		label: 'original symbol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenName: {
		label: 'token name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerAddress: {
		label: 'owner address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenType: {
		label: 'token type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BnbBeaconToken_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'transfers',
		entityType: EntityType.BnbBeaconTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$migrations: {
		label: 'migrations',
		entityType: EntityType.BnbBeaconTokenMigration,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkSymbol: [
			'$network',
			'symbol',
		],
	},
})
