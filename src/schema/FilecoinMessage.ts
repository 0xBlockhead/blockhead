// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinMessage,
	labels: {
		singular: 'filecoin message',
		plural: 'filecoin messages',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	cid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	},
	$to: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	},
	method: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	},
	valueAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	},
	gasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	},
	$$timestamps: {
		entityType: EntityType.FilecoinMessage_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	$receipt: {
		entityType: EntityType.FilecoinMessageReceipt,
		cardinality: EntityFieldCardinality.ZeroOrOne,
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
