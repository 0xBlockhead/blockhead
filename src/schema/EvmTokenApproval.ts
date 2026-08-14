// Generated from APP.ts.

import { EvmTokenApprovalKind, EvmTokenStandard } from '$/constants/Evm.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmTokenApproval,
	labels: {
		singular: 'Token approval',
		plural: 'Token approvals',
	},
	description: 'An approval occurrence emitted by one exact EVM receipt log. It records historical approval intent and is not current allowance state.',
})({
	$log: {
		entityType: EntityType.EvmLog,
		cardinality: EntityFieldCardinality.One,
	},
	$tokenContract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	$owner: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$approvedActor: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	approvalKind: {
		primitiveType: type.enumerated(...Object.values(EvmTokenApprovalKind)),
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		primitiveType: type.enumerated(...Object.values(EvmTokenStandard)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Log: [
			'$log',
		],
	},

	facets: {
		Allowance: facet({
			path: [
				'approvalKind',
			],
			is: 'Allowance',
		})({
			amount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
			},
		}),
		Token: facet({
			path: [
				'approvalKind',
			],
			is: 'Token',
		})({
			tokenId: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
			},
		}),
		Operator: facet({
			path: [
				'approvalKind',
			],
			is: 'Operator',
		})({
			approved: {
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.One,
			},
		}),
	},
})
