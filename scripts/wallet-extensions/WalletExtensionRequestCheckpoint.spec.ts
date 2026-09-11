import assert from 'node:assert/strict'
import test from 'node:test'

import {
	waitForWalletExtensionPhase,
	WalletExtensionPhaseTimeoutError,
	walletExtensionRequestCheckpointFromSnapshots,
	walletExtensionSurfaceCheckpointFromSnapshots,
	walletExtensionStructuralTelemetryFromSnapshot,
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
			visibleFormCount: 1,
			visibleSubmitButtonCount: 1,
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
			origin: 'chrome-extension://abcdefghijklmnopabcdefghijklmnop',
			pageIdentity: 'chrome-extension://abcdefghijklmnopabcdefghijklmnop/popup.html',
			headingNames: ['Sign message', '[redacted]'],
			inputIds: [
				'password',
				'unlock-password',
			],
			visibleFormCount: 1,
			visibleSubmitButtonCount: 1,
			controlRoles: [],
			stableControlIds: [],
			inputTypes: [],
			testIds: [],
			ariaOwners: [],
			disabledControlCount: 0,
			walletErrorCodes: [],
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

test('classifies wallet surfaces from structural evidence without using localized copy', () => {
	const checkpoint = walletExtensionSurfaceCheckpointFromSnapshots([{
		buttonNames: ['Autoriser une demande privée'],
		headingNames: ['Texte localisé sensible'],
		inputIds: ['request-7-private-value'],
		controlRoles: ['dialog', 'button', 'dialog', 'not a role'],
		stableControlIds: ['approve-button'],
		inputTypes: ['password', 'text', 'text'],
		testIds: ['wallet-approve', 'secret private id'],
		ariaOwners: ['wallet-dialog'],
		disabledControlCount: 1,
		walletErrorCodes: ['PHISHING_ORIGIN', 'not safe text'],
		url: 'chrome-extension://walletid/notification.html?secret=private',
	}])

	assert.deepEqual(checkpoint.extensionPages[0], {
		buttonNames: ['[redacted]'],
		headingNames: ['[redacted]'],
		inputIds: [],
		extensionUrl: 'chrome-extension://walletid/notification.html',
		origin: 'chrome-extension://walletid',
		pageIdentity: 'chrome-extension://walletid/notification.html',
		visibleFormCount: 0,
		visibleSubmitButtonCount: 0,
		controlRoles: ['dialog', 'button'],
		stableControlIds: ['approve-button'],
		inputTypes: ['password', 'text'],
		testIds: ['wallet-approve'],
		ariaOwners: ['wallet-dialog'],
		disabledControlCount: 1,
		walletErrorCodes: ['PHISHING_ORIGIN'],
	})
	assert.equal(JSON.stringify(checkpoint).includes('private-value'), false)
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

test('redacts structural telemetry while preserving changed error classes and safe paths', () => {
	const telemetry = walletExtensionStructuralTelemetryFromSnapshot({
		buttons: 4,
		disabledButtons: 2,
		inputs: 1,
		dialogs: 1,
		alerts: 0,
		pageErrors: ['Permission denied for seed phrase private-value', 'Permission denied for seed phrase private-value', 'render timeout token=secret'],
		networkFailures: [{
			url: 'https://wallet.example/request?seed=private',
			status: 403,
			errorText: 'permission denied secret',
		}],
	})
	assert.deepEqual(telemetry, {
		events: [],
		pageControls: [],
		controls: { buttons: 4, disabledButtons: 2, inputs: 1, dialogs: 1, alerts: 0 },
		pageErrors: ['permission', 'timeout'],
		networkFailures: [{ path: 'https://wallet.example/[redacted]', status: 403, classification: 'permission' }],
	})
	assert.equal(JSON.stringify(telemetry).includes('private'), false)
})

test('distinguishes missing controls from disabled controls without inferring refusal', () => {
	const missing = walletExtensionStructuralTelemetryFromSnapshot({ buttons: 0, disabledButtons: 0, inputs: 0, dialogs: 0, alerts: 0, pageErrors: [], networkFailures: [] })
	const disabled = walletExtensionStructuralTelemetryFromSnapshot({ buttons: 2, disabledButtons: 2, inputs: 1, dialogs: 1, alerts: 0, pageErrors: [], networkFailures: [] })
	assert.deepEqual(missing.controls, { buttons: 0, disabledButtons: 0, inputs: 0, dialogs: 0, alerts: 0 })
	assert.deepEqual(disabled.controls, { buttons: 2, disabledButtons: 2, inputs: 1, dialogs: 1, alerts: 0 })
})

test('retains known browser transport failures without echoing arbitrary error messages', () => {
	const errors = ['net::ERR_ABORTED', 'net::ERR_CONNECTION_REFUSED', 'net::ERR_NAME_NOT_RESOLVED', 'net::ERR_FAILED']
	const telemetry = walletExtensionStructuralTelemetryFromSnapshot({
		buttons: 0,
		disabledButtons: 0,
		inputs: 0,
		dialogs: 0,
		alerts: 0,
		pageErrors: [],
		networkFailures: [...errors, 'net::ERR_ABORTED private-value'].map((errorText) => ({
			url: 'https://wallet.example/?secret=private-value',
			status: null,
			errorText,
		})),
	})
	assert.deepEqual(telemetry.networkFailures.map(({ classification }) => classification), [...errors, 'page-error'])
	assert.equal(JSON.stringify(telemetry).includes('private-value'), false)
})
