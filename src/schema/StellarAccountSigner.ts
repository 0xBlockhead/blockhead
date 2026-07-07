// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarAccountSignerSelector {
	AccountSignerKeySignerType = 'AccountSignerKeySignerType',
}
export default {
	entityType: EntityType.StellarAccountSigner,
	label: 'stellar account signer',
	labelPlural: 'stellar account signers',
	selectors: [
		{
			name: StellarAccountSignerSelector.AccountSignerKeySignerType,
			fields: [
				'$account',
				'signerKey',
				'signerType',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signerKey',
			label: 'signer key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signerType',
			label: 'signer type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarAccountSigner_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
