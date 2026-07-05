// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearAccessKeySelector {
	NearAccountPublicKey = 'NearAccountPublicKey',
}
export default {
	entityType: EntityType.NearAccessKey,
	label: 'near access key',
	labelPlural: 'near access keys',
	selectors: [
		{
			name: NearAccessKeySelector.NearAccountPublicKey,
			fields: [
				'$account',
				'publicKey',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'publicKey',
				label: 'Public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'nonce',
				label: 'Nonce',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: 'permission',
				label: 'Permission',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
