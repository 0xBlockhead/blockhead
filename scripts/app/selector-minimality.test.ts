import { app, EntityType } from '../../APP.ts'
import assert from 'node:assert/strict'
import test from 'node:test'
import { auditSelectorWitnesses } from './selector-minimality.ts'

test('proves every market selector member is necessary with a distinct collision witness', () => {
	const audit = auditSelectorWitnesses([
		{ identity: 'baseline', values: { base: 'ETH', quote: 'USD', venue: 'coinbase', kind: 'spot' } },
		{ identity: 'base', values: { base: 'BTC', quote: 'USD', venue: 'coinbase', kind: 'spot' } },
		{ identity: 'quote', values: { base: 'ETH', quote: 'EUR', venue: 'coinbase', kind: 'spot' } },
		{ identity: 'venue', values: { base: 'ETH', quote: 'USD', venue: 'kraken', kind: 'spot' } },
		{ identity: 'kind', values: { base: 'ETH', quote: 'USD', venue: 'coinbase', kind: 'perpetual' } },
	], ['base', 'quote', 'venue', 'kind'])
	assert.deepEqual(audit, { collisions: [], redundantFields: [], missingIndependentFields: [] })
})

test('reports a derivable duplicate coordinate as redundant', () => {
	const audit = auditSelectorWitnesses([
		{ identity: 'mainnet-usdc', values: { network: 'eip155:1', address: '0xa0b8', addressCopy: '0xa0b8' } },
		{ identity: 'base-usdc', values: { network: 'eip155:8453', address: '0xa0b8', addressCopy: '0xa0b8' } },
		{ identity: 'mainnet-usdt', values: { network: 'eip155:1', address: '0xdac1', addressCopy: '0xdac1' } },
	], ['network', 'address', 'addressCopy'])
	assert.deepEqual(audit.redundantFields, ['address', 'addressCopy'])
})

test('reports a derivable sampling methodology omitted from observation identity', () => {
	const witnesses = [
		{ identity: 'relay-window-1', values: { relay: 'flashbots', timestampMs: 1_750_000_000_000, source: 'MevRelay_Rest', sampleLimit: 1 } },
		{ identity: 'relay-window-2', values: { relay: 'flashbots', timestampMs: 1_750_000_000_000, source: 'MevRelay_Rest', sampleLimit: 2 } },
	]
	const currentAudit = auditSelectorWitnesses(witnesses, ['relay', 'timestampMs', 'source'], ['sampleLimit'])
	const correctedAudit = auditSelectorWitnesses(witnesses, ['relay', 'timestampMs', 'source', 'sampleLimit'], ['sampleLimit'])
	assert.deepEqual(currentAudit.collisions, [{ selectorValues: ['flashbots', 1_750_000_000_000, 'MevRelay_Rest'], identities: ['relay-window-1', 'relay-window-2'] }])
	assert.deepEqual(currentAudit.missingIndependentFields, ['sampleLimit'])
	assert.deepEqual(correctedAudit.collisions, [])
	assert.deepEqual(correctedAudit.missingIndependentFields, [])
})

test('the authored Uniswap pool selector distinguishes factory, both tokens and fee', () => {
	const entity = app.schema.entities.find((candidate) => candidate.entityType === EntityType.UniswapV3Pool)
	assert.ok(entity)
	const selector = entity.selectors.find((candidate) => candidate.name === 'FactoryToken0Token1Fee')
	assert.ok(selector)
	const baseline = { $factory: 'factory-a', $token0: 'token-a', $token1: 'token-c', fee: 500 }
	assert.deepEqual(auditSelectorWitnesses([
		{ identity: 'baseline', values: baseline },
		{ identity: 'other-factory', values: { ...baseline, $factory: 'factory-b' } },
		{ identity: 'other-token0', values: { ...baseline, $token0: 'token-b' } },
		{ identity: 'other-token1', values: { ...baseline, $token1: 'token-d' } },
		{ identity: 'other-fee', values: { ...baseline, fee: 3000 } },
	], selector.fields), { collisions: [], redundantFields: [], missingIndependentFields: [] })
})
