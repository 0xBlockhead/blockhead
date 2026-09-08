import assert from 'node:assert/strict'
import test from 'node:test'

import {
	waitForWalletExtensionPhase,
	WalletExtensionPhaseTimeoutError,
	walletExtensionRequestCheckpointFromSnapshots,
	walletExtensionSurfaceCheckpointFromSnapshots,
} from './WalletExtensionRequestCheckpoint.ts'


const createImmediatePhaseClock = () => {
	let completedWaits = 0
	let now = 0
	return {
		clock: {
			now: () => now,
			wait: (milliseconds: number, signal?: AbortSignal) => new Promise<void>((resolve) => {
				const timeout = setTimeout(() => {
					completedWaits += 1
					now += milliseconds
					resolve()
				}, 0)
				signal?.addEventListener('abort', () => clearTimeout(timeout), { once: true })
			}),
		},
		completedWaits: () => completedWaits,
	}
}


test('captures a redacted request checkpoint without returning page payloads or URL parameters', () => {
	// Fault: diagnostics persist secrets from inputs, request URLs, or page copy.
	// Owner: shared wallet-extension checkpoint serializer.
	// Observable: only safe controls, IDs/routes, and parsed counts survive.
	const checkpoint = walletExtensionRequestCheckpointFromSnapshots({
		blockheadUrl: 'https://blockhead.info/~/wallets?token=private-token#secret-fragment',
		extensionPages: [{
			buttonNames: [' Cancel ', 'Sign', 'Sign', 'Approve transfer to 0xprivate'],
			headingNames: [' Sign message ', '', 'Recovery words private-seed'],
			inputIds: [
				'password',
				'seed phrase words',
				'seed-phrase-words-123456',
				'unlock-password',
				'password',
			],
			url: 'chrome-extension://abcdefghijklmnopabcdefghijklmnop/popup.html?message=private-message#approval-secret',
		}],
		walletConnectionsText: 'Wallet discovery active. Providers detected: 3. Active connections: 1. Account 0xprivate',
	})

	assert.deepEqual(checkpoint, {
		blockhead: {
			activeConnectionCount: 1,
			discoveryActive: true,
			providerCount: 3,
			route: '/~/wallets',
			walletSurfacePresent: true,
		},
		extensionPages: [{
			buttonNames: ['Cancel', 'Sign', '[redacted]'],
			extensionUrl: 'chrome-extension://abcdefghijklmnopabcdefghijklmnop/popup.html',
			headingNames: ['Sign message', '[redacted]'],
			inputIds: [
				'password',
				'unlock-password',
			],
		}],
	})
	const serialized = JSON.stringify(checkpoint)
	for (const secret of [
		'private-token',
		'private-message',
		'approval-secret',
		'0xprivate',
		'private-seed',
		'seed phrase words',
		'seed-phrase-words-123456',
	])
		assert.equal(serialized.includes(secret), false)
})

test('returns an owned surface from the first sample and reports each safe change once', async () => {
	// Fault: a polling delay slows a request that is already visible, while identical
	// snapshots flood evidence. Owner: shared wallet-extension phase waiter.
	// Observable: first-sample ownership returns without waiting and one checkpoint emits.
	const checkpoint = walletExtensionSurfaceCheckpointFromSnapshots([{
		buttonNames: ['Continue'],
		headingNames: ['So, let’s check'],
		inputIds: [],
		url: 'chrome-extension://abcdefghijklmnopabcdefghijklmnop/index.html#/secret',
	}])
	const phaseClock = createImmediatePhaseClock()
	const observed: typeof checkpoint[] = []
	const ownedSurface = { id: 'owned-page' }

	assert.equal(await waitForWalletExtensionPhase({
		capture: async () => ({ checkpoint, ownedSurface }),
		clock: phaseClock.clock,
		onCheckpoint: (nextCheckpoint) => observed.push(nextCheckpoint),
		phase: 'Tonkeeper connection authority',
	}), ownedSurface)
	assert.equal(phaseClock.completedWaits(), 0)
	assert.deepEqual(observed, [checkpoint])
})

test('deduplicates unchanged checkpoints and times out with phase and last safe state', async () => {
	// Fault: stalled wallet polling repeats unchanged evidence or loses the failure phase.
	// Owner: shared wallet-extension phase waiter.
	// Observable: changed-only evidence plus typed phase and final redacted checkpoint.
	const first = walletExtensionSurfaceCheckpointFromSnapshots([])
	const last = walletExtensionSurfaceCheckpointFromSnapshots([{
		buttonNames: ['Cancel'],
		headingNames: ['Waiting'],
		inputIds: ['password'],
		url: 'chrome-extension://abcdefghijklmnopabcdefghijklmnop/index.html?secret=value',
	}])
	const samples = [first, first, last]
	const observed: typeof first[] = []
	const phaseClock = createImmediatePhaseClock()
	let sampleIndex = 0

	await assert.rejects(waitForWalletExtensionPhase({
		capture: async () => ({
			checkpoint: samples[Math.min(sampleIndex++, samples.length - 1)] ?? last,
			ownedSurface: null,
		}),
		clock: phaseClock.clock,
		onCheckpoint: (checkpoint) => observed.push(checkpoint),
		phase: 'Tonkeeper transaction authority',
		pollMilliseconds: 5,
		timeoutMilliseconds: 15,
	}), (error) => {
		assert.equal(error instanceof WalletExtensionPhaseTimeoutError, true)
		if (!(error instanceof WalletExtensionPhaseTimeoutError)) return false
		assert.equal(error.phase, 'Tonkeeper transaction authority')
		assert.deepEqual(error.lastCheckpoint, last)
		assert.equal(error.message.includes('secret=value'), false)
		return true
	})
	assert.deepEqual(observed, [first, last])
})

test('bounds a stalled capture and cancels its deadline timer', async () => {
	// Fault: a page snapshot never settles, bypassing the phase timeout and retaining its timer.
	// Owner: shared wallet-extension phase waiter.
	// Observable: the typed timeout returns with the last safe state and aborts the owned timer.
	let timerAborted = false
	await assert.rejects(waitForWalletExtensionPhase({
		capture: () => new Promise(() => {}),
		clock: {
			now: () => 0,
			wait: async (_milliseconds, signal) => {
				signal?.addEventListener('abort', () => { timerAborted = true }, { once: true })
			},
		},
		phase: 'Tonkeeper stalled page capture',
		timeoutMilliseconds: 10,
	}), (error) => (
		error instanceof WalletExtensionPhaseTimeoutError
		&& error.phase === 'Tonkeeper stalled page capture'
		&& error.lastCheckpoint.extensionPages.length === 0
	))
	assert.equal(timerAborted, true)
})

test('reports a missing Blockhead wallet surface instead of treating it as zero connections', () => {
	assert.equal(walletExtensionRequestCheckpointFromSnapshots({
		blockheadUrl: 'not a url',
		extensionPages: [],
		walletConnectionsText: null,
	}).blockhead.walletSurfacePresent, false)
})
