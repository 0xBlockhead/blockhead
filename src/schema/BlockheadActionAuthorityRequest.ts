// Generated from APP.ts.

import { actionRevisionBinding, authorityDecision, authorityRequestEnvelope } from '$/actions/execution.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadActionAuthorityRequest,
	labels: {
		singular: 'authority request',
		plural: 'authority requests',
	},
	description: 'One immutable consent envelope presented by Blockhead to one addressed authority.',
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionRevisionBindings: {
		primitiveType: actionRevisionBinding,
		cardinality: EntityFieldCardinality.Many,
	},
	$$sessionActions: {
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.Many,
	},
	$walletConnection: {
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	envelope: {
		primitiveType: authorityRequestEnvelope,
		cardinality: EntityFieldCardinality.One,
	},
	envelopeHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.One,
	},
	presentedAt: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	decision: {
		primitiveType: authorityDecision,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$dispatchOccurrences: {
		entityType: EntityType.BlockheadActionDispatchOccurrence,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
