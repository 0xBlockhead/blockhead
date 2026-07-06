// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EasSchemaSelector {
	NetworkSchemaUid = 'NetworkSchemaUid',
}
export default {
	entityType: EntityType.EasSchema,
	label: 'EAS schema',
	labelPlural: 'EAS schemas',
	selectors: [
		{
			name: EasSchemaSelector.NetworkSchemaUid,
			fields: [
				'$network',
				'schemaUid',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'schemaUid',
			label: 'Schema UID',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'schema',
			label: 'Schema',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'resolver',
			label: 'Resolver',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$resolverContract',
			label: 'Resolver contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'revocable',
			label: 'Revocable',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registerer',
			label: 'Registerer',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$registererAccount',
			label: 'Registerer account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registeredAt',
			label: 'Registered at',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registeredTransactionHash',
			label: 'Registered transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registeredLogIndex',
			label: 'Registered log index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$attestations',
			label: 'Attestations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EasAttestation,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
