// Generated from APP.ts.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$topics: {
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
	},
	topic0: {
		primitiveType: EvmTopicHash,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	removed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$emitter: {
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
				'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
				'0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
			],
		})({
			signatureHash: {
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
						entityType: EntityType.EvmTokenTransfer,
						cardinality: EntityFieldCardinality.Many,
					},
				}),
				TokenApproval: facet({
					path: [
						'Event',
						'signatureHash',
					],
					isOneOf: [
						'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
						'0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
					],
				})({
					$tokenApproval: {
						entityType: EntityType.EvmTokenApproval,
						cardinality: EntityFieldCardinality.One,
					},
				}),
			},
		}),
	},
})
