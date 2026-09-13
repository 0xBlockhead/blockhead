import assert from 'node:assert/strict'
import test from 'node:test'

import {
	app,
	EntityType,
	Source,
} from '../../APP.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
} from './model.ts'


test('owns the active network upgrade on the resolved EVM block', () => {
	const evmBlock = app.schema.entities.find(({ entityType }) => (
		entityType === EntityType.EvmBlock
	))

	assert.ok(evmBlock)
	assert.deepEqual(evmBlock.fields.find(({ name }) => (
		name === '$activeNetworkUpgrade'
	)), {
		name: '$activeNetworkUpgrade',
		label: 'Active network upgrade',
		description: "The latest network upgrade proven active at this block's execution height and time.",
		type: EntityFieldType.EntityReference,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		entityType: EntityType.EthereumNetworkUpgrade,
		defaultSources: [Source.Voltaire_JsonRpc],
	})
})
