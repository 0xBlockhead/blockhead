// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadWalletAuthenticationSelector {
	AuthenticationId = 'AuthenticationId',
}
export default {
	entityType: EntityType.BlockheadWalletAuthentication,
	label: 'blockhead wallet authentication',
	labelPlural: 'blockhead wallet authentications',
	selectors: [
		{
			name: BlockheadWalletAuthenticationSelector.AuthenticationId,
			fields: [
				'authenticationId',
			],
		},
	],
	fields: [
		{
				name: 'authenticationId',
				label: 'authentication ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$connection',
				label: 'connection',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWalletConnection,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWalletAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'protocol',
				label: 'protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'statement',
				label: 'statement',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'domain',
				label: 'domain',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'uri',
				label: 'URI',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nonce',
				label: 'nonce',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'issuedAt',
				label: 'issued AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'expirationTime',
				label: 'expiration time',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'notBefore',
				label: 'not before',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'chainId',
				label: 'Chain ID',
				description: 'The chain identifier used by the network family.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signature',
				label: 'signature',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'verified',
				label: 'verified',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'verifiedAt',
				label: 'verified AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'error',
				label: 'error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
