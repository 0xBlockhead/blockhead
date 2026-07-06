// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinActorSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.FilecoinActor,
	label: 'filecoin actor',
	labelPlural: 'filecoin actors',
	selectors: [
		{
			name: FilecoinActorSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
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
			name: 'address',
			label: 'Address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actorCodeCid',
			label: 'Actor code CID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
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
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			],
		},
		{
			name: 'balanceAttoFil',
			label: 'Balance attoFIL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
