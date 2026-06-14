import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NearAccessKeySelector {
	NearAccountPublicKey = 'nearAccountPublicKey',
}

export default {
	entityType: EntityType.NearAccessKey,

	label: 'NEAR Access Key',
	labelPlural: 'NEAR Access Keys',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'publicKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'permission',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
