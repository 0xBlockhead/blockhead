import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FilecoinBlockSelector {
	NetworkCid = 'networkCid',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'cid',
			label: 'CID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$tipset',
			label: 'tipset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$miner',
			label: 'miner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinMiner,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ticketVrFProof',
			label: 'ticket vr f proof',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'winCount',
			label: 'win count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinMessage,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
