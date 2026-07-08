// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarAccountSignerSelector {
	AccountSignerKeySignerType = 'AccountSignerKeySignerType',
}
export const StellarAccountSigner = entity({
	entityType: EntityType.StellarAccountSigner,
	label: 'stellar account signer',
	labelPlural: 'stellar account signers',
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.One,
	},
	signerKey: {
		label: 'signer key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signerType: {
		label: 'signer type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
