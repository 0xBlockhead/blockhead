// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinBlockSelector {
	NetworkCid = 'NetworkCid',
}
export default {
	entityType: EntityType.FilecoinBlock,
	label: 'filecoin block',
	labelPlural: 'filecoin blocks',
	selectors: [
		{
			name: FilecoinBlockSelector.NetworkCid,
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
			name: '$tipset',
			label: 'Tipset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			],
		},
		{
			name: '$miner',
			label: 'Miner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinMiner,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			],
		},
		{
			name: 'ticketVrFProof',
			label: 'Ticket VRF proof',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: 'winCount',
			label: 'Win count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: '$$messages',
			label: 'Messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinMessage,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lotus_JsonRpc,
				Source.Filfox_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
