// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TrustedIssuerSelector {
	ProfileIssuerKey = 'ProfileIssuerKey',
}
export default {
	entityType: EntityType.TrustedIssuer,
	label: 'trusted issuer',
	labelPlural: 'trusted issuers',
	selectors: [
		{
			name: TrustedIssuerSelector.ProfileIssuerKey,
			fields: [
				'$profile',
				'issuerKey',
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
			name: 'issuerKey',
			label: 'issuer key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'issuerSelector',
			label: 'issuer selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'claimTopics',
			label: 'claim topics',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
