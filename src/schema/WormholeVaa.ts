import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.WormholeVaa,
	labels: {
		singular: 'Wormhole VAA',
		plural: 'Wormhole VAAs',
	},
})({
	emitterChain: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	emitter: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	guardianSetIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	emitterNativeAddr: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EmitterChainEmitterSequence: [
			'emitterChain',
			'emitter',
			'sequence',
		],
	},
})
