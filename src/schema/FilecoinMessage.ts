// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinMessageSelector {
	NetworkCid = 'NetworkCid',
}
export default {
	entityType: EntityType.FilecoinMessage,
	label: 'filecoin message',
	labelPlural: 'filecoin messages',
	selectors: [
		{
			name: FilecoinMessageSelector.NetworkCid,
			fields: [
				'$network',
				'cid',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'cid',
			label: 'CID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$from',
			label: 'From',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Filfox_Rest,
			],
		},
		{
			name: '$to',
			label: 'To',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Filfox_Rest,
			],
		},
		{
			name: 'method',
			label: 'Method',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Filfox_Rest,
			],
		},
		{
			name: 'nonce',
			label: 'Nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Filfox_Rest,
			],
		},
		{
			name: 'valueAttoFil',
			label: 'Value attoFIL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Filfox_Rest,
			],
		},
		{
			name: 'gasLimit',
			label: 'Gas limit',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Filfox_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
