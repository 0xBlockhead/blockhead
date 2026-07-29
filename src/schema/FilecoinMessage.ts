// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
	$from: {
		label: 'From',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	$to: {
		label: 'To',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	method: {
		label: 'Method',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	nonce: {
		label: 'Nonce',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	valueAttoFil: {
		label: 'Value attoFIL',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	gasLimit: {
		label: 'Gas limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
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
