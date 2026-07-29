// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinSector,
	labels: {
		singular: 'filecoin sector',
		plural: 'filecoin sectors',
	},
})({
	$miner: {
		label: 'Miner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.One,
	},
	sectorNumber: {
		label: 'Sector number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	sealedCid: {
		label: 'Sealed CID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	activationEpoch: {
		label: 'Activation epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	expirationEpoch: {
		label: 'Expiration epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
})({
	selectors: {
		FilecoinMinerSectorNumber: [
			'$miner',
			'sectorNumber',
		],
	},
})
