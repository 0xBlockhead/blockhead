import { describe, expect, it, vi } from 'vitest'

import type { NetworkEntityPresentationV1 } from './NetworkEntityPresentationV1.ts'
import {
	freezePresentation,
	materializeResource,
	createNetworkPresentationSessionFromDriver,
	type NetworkPresentationDriver,
	type NetworkPresentationDriverSnapshot,
} from './createNetworkPresentationSession.svelte.ts'

const mutablePresentation = (): NetworkEntityPresentationV1 => ({
	schemaVersion: 'NetworkEntityPresentationV1',
	revision: 0,
	route: '/network/eip155:1',
	chrome: {
		brand: 'Blockhead',
		navigation: [{ label: 'Ethereum', target: '/network/eip155:1', selected: true }],
		selectedTarget: '/network/eip155:1',
		mainContentLabel: 'Ethereum network',
	},
	entity: {
		entityType: 'Network',
		selectorKey: '{"caip2":{"namespace":"eip155","reference":"1"}}',
		selector: { caip2: { namespace: 'eip155', reference: '1' } },
		fallbackTitle: 'eip155:1',
		title: 'Ethereum',
		annotation: 'Network',
		value: 'eip155:1',
		expanded: true,
	},
	summary: [{
		id: 'block', label: 'Block', owner: 'Network.Evm.$$blocks',
		sources: ['Voltaire_JsonRpc'], state: 'pending', observation: 0,
		value: null, target: null, error: null, retryToken: null,
	}],
	details: [{ id: 'network-stack', label: 'Network stack', value: 'Ethereum', fullValue: 'Ethereum' }],
	execution: {
		label: 'Execution',
		selectedSection: 'blocks',
		sections: {
			blocks: {
				id: 'blocks', label: 'Blocks', owner: 'Network.Evm.$$blocks',
				sources: ['Voltaire_JsonRpc'], state: 'resolved-empty', observation: 1,
				limit: 4, rows: [], error: null, retryToken: null,
			},
			transactions: {
				id: 'transactions', label: 'Transactions', owner: 'Network.Evm.$$transactions',
				sources: ['Blockscout_Rest'], state: 'resolved-empty', observation: 1,
				limit: 16, rows: [], error: null, retryToken: null,
			},
		},
	},
	diagnostics: {
		mountId: 'owner-test', subscriptionGeneration: 1,
		activeSubscriptions: 1, persistenceGeneration: 1,
	},
})

describe('network presentation resource materialization', () => {
	it.each([
		{
			label: 'pending has no payload',
			resource: { current: undefined, loading: true, ready: false, error: undefined },
			expected: { state: 'pending', value: null, target: null, error: null },
		},
		{
			label: 'ready empty is not pending',
			resource: { current: { value: null }, loading: false, ready: true, error: undefined },
			expected: { state: 'resolved-empty', value: null, target: null, error: null },
		},
		{
			label: 'ready payload retains its canonical target',
			resource: { current: { value: '42', target: '/network/example/block/42' }, loading: false, ready: true, error: undefined },
			expected: { state: 'resolved-nonempty', value: '42', target: '/network/example/block/42', error: null },
		},
	] as const)('$label', ({ resource, expected }) => {
		expect(materializeResource(resource, (current) => current ?? { value: null })).toEqual(expected)
	})

	it('failure wins over stale current and clears its payload', () => {
		expect(materializeResource({
			current: { value: 'stale' },
			loading: false,
			ready: true,
			error: new Error('source unavailable'),
		}, (current) => current ?? { value: null })).toEqual({
			state: 'failed',
			value: null,
			target: null,
			error: 'source unavailable',
		})
	})
})

describe('network presentation packet ownership', () => {
	it('freezes every renderer-visible mutable boundary and detaches caller arrays', () => {
		const input = mutablePresentation()
		const packet = freezePresentation(input)

		expect(Object.isFrozen(packet)).toBe(true)
		expect(Object.isFrozen(packet.chrome.navigation)).toBe(true)
		expect(Object.isFrozen(packet.chrome.navigation[0])).toBe(true)
		expect(Object.isFrozen(packet.entity.selector.caip2)).toBe(true)
		expect(Object.isFrozen(packet.summary)).toBe(true)
		expect(Object.isFrozen(packet.summary[0].sources)).toBe(true)
		expect(Object.isFrozen(packet.details[0])).toBe(true)
		expect(Object.isFrozen(packet.execution.sections.blocks.rows)).toBe(true)
		expect(packet.chrome.navigation).not.toBe(input.chrome.navigation)
		expect(Reflect.set(packet.entity, 'title', 'mutated')).toBe(false)
		expect(packet.entity.title).toBe('Ethereum')
	})
})

const emptyCell = {
	state: 'resolved-empty',
	value: null,
	target: null,
	error: null,
} as const

const readyDriverSnapshot = (): NetworkPresentationDriverSnapshot => ({
	title: 'Ethereum',
	details: {
		name: 'Ethereum',
		namespace: 'eip155',
		ledgerModels: 'Accounts',
		executionModels: 'EVM',
		networkStack: 'Ethereum',
		environment: 'mainnet',
	},
	summary: {
		upgrade: emptyCell,
		block: emptyCell,
		feeMarket: emptyCell,
		nativePrice: emptyCell,
		mempool: emptyCell,
		epoch: emptyCell,
		slot: emptyCell,
	},
	blocks: { state: 'resolved-empty', rows: [], error: null },
	transactions: { state: 'resolved-empty', rows: [], error: null },
})

const sessionFixture = (
	overrides: Partial<NetworkPresentationDriver> = {},
	checkpoint?: Parameters<typeof createNetworkPresentationSessionFromDriver>[1]['checkpoint']
) => {
	let invalidate = () => undefined
	let snapshot = readyDriverSnapshot()
	const retry = vi.fn()
	const stop = vi.fn()
	const driver: NetworkPresentationDriver = {
		selectorKey: '{"caip2":{"namespace":"eip155","reference":"1"}}',
		selector: { caip2: { namespace: 'eip155', reference: '1' } },
		read: () => snapshot,
		watch: (next) => {
			invalidate = next
			return stop
		},
		retry,
		...overrides,
	}
	const checkpoints: Parameters<NonNullable<Parameters<typeof createNetworkPresentationSessionFromDriver>[1]['saveCheckpoint']>>[0][] = []
	const session = createNetworkPresentationSessionFromDriver(driver, {
		route: '/network/eip155:1',
		navigation: [
			{ label: 'Explore', target: '/~/explore', selected: false },
			{ label: 'Networks', target: '/networks', selected: false },
			{ label: 'Ethereum', target: '/network/eip155:1', selected: true },
		],
		mountId: 'fake-driver',
		subscriptionGeneration: 1,
		persistenceGeneration: 1,
		initialRevision: 0,
		checkpoint,
		saveCheckpoint: (value) => { checkpoints.push(value) },
		navigate: vi.fn(),
		back: vi.fn(() => '/network/eip155:1'),
		focusMain: vi.fn(),
	})
	return {
		session,
		retry,
		stop,
		checkpoints,
		invalidate: () => invalidate(),
		setSnapshot: (value: NetworkPresentationDriverSnapshot) => { snapshot = value },
	}
}

describe('network presentation driver session', () => {
	it('emits the exact frozen product denominator and representative chrome', async () => {
		const fixture = sessionFixture()

		expect(fixture.session.current.chrome.navigation.map(({ label }) => label)).toEqual([
			'Explore',
			'Networks',
			'Ethereum',
		])
		expect(fixture.session.current.summary.map(({ id, label }) => [id, label])).toEqual([
			['upgrade', 'Upgrade'],
			['block', 'Block'],
			['fee-market', 'Fee market'],
			['native-price', 'Native price'],
			['mempool', 'Mempool'],
			['epoch', 'Epoch'],
			['slot', 'Slot'],
		])
		expect(fixture.session.current.details.map(({ id, label }) => [id, label])).toEqual([
			['name', 'Name'],
			['namespace', 'Namespace'],
			['ledger-models', 'Ledger models'],
			['execution-models', 'Execution models'],
			['network-stack', 'Network stack'],
			['environment', 'Environment'],
			['caip2', 'CAIP-2'],
		])
		fixture.session.destroy()
		await fixture.session.closed
	})

	it('coalesces adjacent driver invalidations into one revision', async () => {
		const fixture = sessionFixture()
		const revisions: number[] = []
		fixture.session.subscribe((snapshot) => { revisions.push(snapshot.revision) })
		fixture.setSnapshot({ ...readyDriverSnapshot(), title: 'Ethereum Mainnet' })
		fixture.invalidate()
		fixture.invalidate()
		await Promise.resolve()

		expect(revisions).toEqual([0, 1])
		fixture.session.destroy()
		await fixture.session.closed
	})

	it('does not consume a retry token when its owner throws', async () => {
		const failed = {
			state: 'failed', value: null, target: null,
			error: 'source unavailable',
		} as const
		const retry = vi.fn(() => { throw new Error('retry unavailable') })
		const fixture = sessionFixture({
			read: () => ({
				...readyDriverSnapshot(),
				summary: { ...readyDriverSnapshot().summary, block: failed },
			}),
			retry,
		})
		const token = fixture.session.current.summary.find((cell) => cell.id === 'block')?.retryToken
		expect(token).toBe('retry-network-block-1')
		if (token === null || token === undefined)
			throw new Error('failed block did not expose its retry token')
		await expect(fixture.session.dispatch({ type: 'retry', cellId: 'block', retryToken: token })).rejects.toThrow('retry unavailable')
		await expect(fixture.session.dispatch({ type: 'retry', cellId: 'block', retryToken: token })).rejects.toThrow('retry unavailable')
		expect(retry).toHaveBeenCalledTimes(2)
		fixture.session.destroy()
		await fixture.session.closed
	})

	it('starts a new failure episode after recovery', async () => {
		const fixture = sessionFixture()
		const failed = {
			state: 'failed', value: null, target: null,
			error: 'source unavailable',
		} as const
		const withBlock = (block: typeof failed | typeof emptyCell): NetworkPresentationDriverSnapshot => ({
			...readyDriverSnapshot(),
			summary: { ...readyDriverSnapshot().summary, block },
		})
		fixture.setSnapshot(withBlock(failed))
		fixture.invalidate()
		await Promise.resolve()
		expect(fixture.session.current.summary.find((cell) => cell.id === 'block')?.retryToken).toBe('retry-network-block-1')
		fixture.setSnapshot(withBlock(emptyCell))
		fixture.invalidate()
		await Promise.resolve()
		fixture.setSnapshot(withBlock(failed))
		fixture.invalidate()
		await Promise.resolve()
		expect(fixture.session.current.summary.find((cell) => cell.id === 'block')?.retryToken).toBe('retry-network-block-2')
		fixture.session.destroy()
		await fixture.session.closed
	})

	it('restores a matching checkpoint and drains an in-flight action before close', async () => {
		let releaseNavigation = () => undefined
		const navigate = vi.fn(() => new Promise<void>((resolve) => { releaseNavigation = resolve }))
		const checkpoint = {
			schemaVersion: 1,
			selectorKey: '{"caip2":{"namespace":"eip155","reference":"1"}}',
			revision: 7,
			route: '/network/eip155:1/block/7',
			persistenceGeneration: 1,
			observations: [],
			failures: [],
		} as const
		const restored = createNetworkPresentationSessionFromDriver({
			selectorKey: checkpoint.selectorKey,
			selector: { caip2: { namespace: 'eip155', reference: '1' } },
			read: readyDriverSnapshot,
			watch: () => vi.fn(),
			retry: vi.fn(),
		}, {
			route: '/network/eip155:1',
			navigation: [{ label: 'Ethereum', target: '/network/eip155:1', selected: true }],
			mountId: 'restored', subscriptionGeneration: 2,
			persistenceGeneration: 2, initialRevision: 0, checkpoint,
			saveCheckpoint: vi.fn(), navigate, back: vi.fn(() => '/network/eip155:1'), focusMain: vi.fn(),
		})
		expect(restored.current.revision).toBe(8)
		expect(restored.current.route).toBe('/network/eip155:1/block/7')
		const action = restored.dispatch({ type: 'navigate', target: '/network/eip155:1/block/8' })
		await Promise.resolve()
		expect(navigate).toHaveBeenCalledOnce()
		restored.destroy()
		let closed = false
		void restored.closed.then(() => { closed = true })
		await Promise.resolve()
		expect(closed).toBe(false)
		releaseNavigation()
		await expect(action).rejects.toThrow('destroyed during navigation')
		await restored.closed
		expect(restored.checkpoint.route).toBe('/network/eip155:1/block/7')
	})
})
