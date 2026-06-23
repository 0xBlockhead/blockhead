import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum Eip7702AuthorizationSelector {
	TransactionAuthorizationIndex = '$transaction+authorizationIndex',
}
export default {
	entityType: EntityType.Eip7702Authorization,
	label: 'eip7702 authorization',
	labelPlural: 'eip7702 authorizations',
	selectors: [
		{
			name: Eip7702AuthorizationSelector.TransactionAuthorizationIndex,
			fields: [
				'$transaction',
				'authorizationIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'authorizationIndex',
			label: 'authorization index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'chainId',
			label: 'Chain ID',
			description: 'The chain identifier used by the network family.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'delegationAddress',
			label: 'delegation address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'authority',
			label: 'authority',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			label: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'yParity',
			label: 'y parity',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'r',
			label: 'r',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 's',
			label: 's',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'verificationStatus',
			label: 'verification status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedAtMs',
			label: 'verified AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$authorityAccount',
			label: 'authority account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$delegationContract',
			label: 'delegation contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
