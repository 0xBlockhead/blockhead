import { expect, it } from 'vitest'
import { schema, entityDefinitionByType } from '../schema/index.ts'
import { acquireNetworkPresentationDriver } from './createNetworkPresentationSession.svelte.ts'

it('acquires resource-returning references once and projects nested quote values', () => {
	const calls = []
	const resource = (current) => ({ current, loading: false, ready: true, error: undefined })
	const reference = (name, current = { values: [] }) => (options) => {
		calls.push({ name, options })
		return resource(current)
	}
	const selection = Object.assign(() => resource({ name: 'Ethereum' }), {
		$networkStack: reference('$networkStack', { label: 'Ethereum' }),
		Evm: {
			$$upgrades: reference('$$upgrades'),
			$$blocks: reference('$$blocks'),
			$$gasFeeBlocks: reference('$$gasFeeBlocks'),
			$nativeCoin: reference('$nativeCoin', {
				$$marketsWithCoinAsBase: { values: [{ $$marketPrices: { values: [{ $$quotes: { values: [{ price: 420000000000n }] } }] } }] },
			}),
			$$txpoolTimestamps: reference('$$txpoolTimestamps'),
			$$beaconEpochs: reference('$$beaconEpochs'),
			$$beaconSlots: reference('$$beaconSlots'),
			$$transactions: reference('$$transactions'),
		},
	})
	// Resource-returning fixture matches the actual client boundary that rejected
	// the former method chain; it deliberately has no callable resource fallback.
	const driver = acquireNetworkPresentationDriver({ schema, entityDefinitionByType, select: () => selection }, { caip2: { namespace: 'eip155', reference: '1' } })
	expect(driver.read().summary.nativePrice).toEqual({ state: 'resolved-nonempty', value: '4,200', target: null, error: null })
	const nativeSelection = calls.find(({ name }) => name === '$nativeCoin').options
	expect(nativeSelection.fields.$$marketsWithCoinAsBase.fields.$$marketPrices.fields.$$quotes.fields).toEqual({ price: true })
	expect(calls.find(({ name, options }) => name === '$$blocks' && options.limit === 4).options.fields).toEqual({ blockNumber: true, hash: true })
	expect(calls.find(({ name }) => name === '$$transactions').options.fields).toEqual({ txHash: true })
})
