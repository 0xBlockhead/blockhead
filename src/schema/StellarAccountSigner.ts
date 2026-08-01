// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarAccountSigner,
	labels: {
		singular: 'stellar account signer',
		plural: 'stellar account signers',
	},
})({
	$account: {
		label: 'account',
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.One,
	},
	signerKey: {
		label: 'signer key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signerType: {
		label: 'signer type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.StellarAccountSigner_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountSignerKeySignerType: [
			'$account',
			'signerKey',
			'signerType',
		],
	},
})
