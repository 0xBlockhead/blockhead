// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinBlock,
	labels: {
		singular: 'filecoin block',
		plural: 'filecoin blocks',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	cid: {
		label: 'CID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$tipset: {
		label: 'Tipset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	},
	$miner: {
		label: 'Miner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	},
	ticketVrFProof: {
		label: 'Ticket VRF proof',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	winCount: {
		label: 'Win count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	$$messages: {
		label: 'Messages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FilecoinMessage,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
})({
	selectors: {
		NetworkCid: [
			'$network',
			'cid',
		],
	},
})
