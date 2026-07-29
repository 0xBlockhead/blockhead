// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmTopicHash, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmLog,
	labels: {
		singular: 'EVM log',
		plural: 'EVM logs',
	},
	description: 'An event log emitted by an EVM transaction receipt.',
})({
	indexInTransaction: {
		label: 'Index in transaction',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$topics: {
		label: 'Topics',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
	},
	topic0: {
		label: 'Topic 0',
		type: EntityFieldType.Primitive,
		primitiveType: EvmTopicHash,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		label: 'Data',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	removed: {
		label: 'Removed',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$emitter: {
		label: 'Emitter contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionIndexInTransaction: [
			'$transaction',
			'indexInTransaction',
		],
	},

	facets: {
		Event: facet({
			path: [
				'topic0',
			],
			isOneOf: [
				'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
				'0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
				'0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
			],
		})({
			signatureHash: {
				label: 'Signature hash',
				type: EntityFieldType.Primitive,
				primitiveType: EvmTopicHash,
				cardinality: EntityFieldCardinality.One,
			},
		})({
			facets: {
				TokenTransfer: facet({
					path: [
						'Event',
						'signatureHash',
					],
					isOneOf: [
						'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
						'0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
						'0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
					],
				})({
					$$tokenTransfers: {
						label: 'Token transfers',
						type: EntityFieldType.EntitiesReference,
						entityType: EntityType.EvmTokenTransfer,
						cardinality: EntityFieldCardinality.Many,
					},
				}),
			},
		}),
	},
})
