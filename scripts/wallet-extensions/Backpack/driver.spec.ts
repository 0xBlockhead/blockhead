import assert from 'node:assert/strict'
import test from 'node:test'
import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	backpackBlockedObservation,
	backpackDriver,
	backpackRequestDiagnostic,
	backpackSignMessageInput,
	backpackSolanaMainnet,
	classifyBackpackRequestSurface,
	isBackpackWalletStandardIdentity,
	isBackpackPopupPageUrl,
	verifyBackpackSignMessageOutput,
} from './driver.ts'
import { backpackWalletMatrixScenarios } from './matrix.ts'


const privateKey = new Uint8Array(32).fill(42)
const publicKey = ed25519.getPublicKey(privateKey)
const accountAddress = base58.encode(publicKey)
const backpackWallet = {
	accounts: [{
		address: accountAddress,
		chains: ['solana:mainnet'],
		features: ['solana:signMessage'],
		publicKey,
	}],
	chains: ['solana:mainnet'],
	features: {
		'solana:signMessage': {},
		'standard:connect': {},
		'standard:events': {},
	},
	icon: 'data:image/svg+xml;base64,PHN2Zy8+',
	name: 'Backpack',
}


test('maps headed Connect chrome to Backpack popup.html URLs', () => {
	const extensionId = 'aflkmfhebedbjioipglgcbcmnbpgliof'
	assert.equal(isBackpackPopupPageUrl(`chrome-extension://${extensionId}/popup.html`, extensionId), true)
	assert.equal(isBackpackPopupPageUrl(`chrome-extension://${extensionId}/popup.html#/`, extensionId), true)
	assert.equal(isBackpackPopupPageUrl(`chrome-extension://${extensionId}/options.html`, extensionId), false)
	assert.equal(isBackpackPopupPageUrl(`chrome-extension://other/popup.html`, extensionId), false)
})

test('accepts Backpack capability only for one exact response bound to the selected account and message', () => {
	// Fault: popup approval, extra outputs, or a sibling key earns Backpack
	// capability. Owner: Backpack Wallet Standard response audit. Observable:
	// exactly one Ed25519 signature verifies over the requested bytes and account.
	const message = new TextEncoder().encode('Blockhead local Backpack consent challenge')
	const signature = ed25519.sign(message, privateKey)
	assert.deepEqual(verifyBackpackSignMessageOutput({
		accountAddress,
		message,
		network: backpackSolanaMainnet,
		outputs: [{ signature }],
		wallet: backpackWallet,
	}), signature)
	assert.throws(() => verifyBackpackSignMessageOutput({
		accountAddress,
		message,
		network: backpackSolanaMainnet,
		outputs: [{ signature }, { signature }],
		wallet: backpackWallet,
	}), /must return one output/)
	assert.throws(() => verifyBackpackSignMessageOutput({
		accountAddress,
		message,
		network: backpackSolanaMainnet,
		outputs: [{ signature: ed25519.sign(message, new Uint8Array(32).fill(24)) }],
		wallet: backpackWallet,
	}), /does not bind/)
})

test('binds a Backpack signMessage input to the connected Wallet Standard account', () => {
	// Fault: a generic Solana wallet or unowned account reaches Backpack consent.
	// Owner: Backpack Wallet Standard request construction.
	// Observable: the exact registered account object and non-empty bytes are returned.
	const message = new TextEncoder().encode('Blockhead local Backpack consent challenge')
	const request = backpackSignMessageInput(backpackWallet, accountAddress, message, backpackSolanaMainnet)

	assert.equal(isBackpackWalletStandardIdentity(backpackWallet), true)
	assert.equal(request.account, backpackWallet.accounts[0])
	assert.equal(request.message, message)
	assert.equal(request.network, backpackSolanaMainnet)
	assert.equal(isBackpackWalletStandardIdentity({
		...backpackWallet,
		name: 'Phantom',
	}), false)
	assert.throws(
		() => backpackSignMessageInput(backpackWallet, 'DifferentAccount1111111111111111111111111', message, backpackSolanaMainnet),
		/does not own/
	)
	assert.throws(
		() => backpackSignMessageInput(backpackWallet, accountAddress, new Uint8Array(), backpackSolanaMainnet),
		/must not be empty/
	)
	assert.throws(
		() => backpackSignMessageInput({
			...backpackWallet,
			accounts: [{ ...backpackWallet.accounts[0], chains: ['solana:devnet'] }],
			chains: ['solana:devnet'],
		}, accountAddress, message, backpackSolanaMainnet),
		/requested Solana network/
	)
})

test('owns only phase-specific Backpack requests for the intended provider and Solana account', () => {
	const extensionId = 'aflkmfhebedbjioipglgcbcmnbpgliof'
	const url = `chrome-extension://${extensionId}/popup.html#/approval`
	const accountAddress = '9xQeWvG816bUx9EPfEZLLqvRYcQdhAkZjfLHLXEbiVd'
	const intendedProvider = 'https://blockhead.info/wallets'
	const classify = (
		kind: 'connect' | 'message' | 'transaction' | 'send',
		headingNames: readonly string[],
		buttonNames: readonly string[],
		visibleText = `blockhead.info ${accountAddress}`,
		candidateUrl = url
	) => classifyBackpackRequestSurface({
		accountAddress,
		buttonNames,
		extensionId,
		headingNames,
		intendedProvider,
		kind,
		url: candidateUrl,
		visibleText,
	}).ownsRequest

	assert.equal(classify('connect', ['Connect'], ['Deny', 'Connect']), true)
	assert.equal(classify('message', ['Sign message'], ['Cancel', 'Sign']), true)
	assert.equal(classify('transaction', ['Sign transaction'], ['Reject', 'Sign']), true)
	assert.equal(classify('send', ['Confirm transaction'], ['Cancel', 'Confirm']), true)
	assert.equal(
		classify('message', ['Sign message'], ['Cancel', 'Sign'], 'blockhead.info 9xQe...biVd'),
		true,
		'compact Solana identity remains bindable'
	)

	assert.equal(classify('message', ['Wallet'], ['Receive', 'Send']), false, 'wallet home is not consent')
	assert.equal(classify('message', ['Connect'], ['Deny', 'Connect']), false, 'connect is not message signing')
	assert.equal(classify('transaction', ['Sign message'], ['Cancel', 'Sign']), false, 'message signing is not transaction signing')
	assert.equal(classify('send', ['Sign transaction'], ['Cancel', 'Sign']), false, 'sign-only is not sign-and-send consent')
	assert.equal(classify('message', ['Approval'], ['Cancel', 'Sign']), false, 'generic signing UI does not own a message')
	assert.equal(classify('send', ['Approval'], ['Cancel', 'Confirm']), false, 'generic confirmation does not own a send')
	assert.equal(classify('message', ['Sign message'], ['Sign']), false, 'both decisions must be present')
	assert.equal(classify('message', ['Sign message'], ['Cancel', 'Sign'], `evil.example ${accountAddress}`), false)
	assert.equal(classify('message', ['Sign message'], ['Cancel', 'Sign'], 'blockhead.info wrong-account'), false)
	assert.equal(
		classify('message', ['Sign message'], ['Cancel', 'Sign'], undefined, 'chrome-extension://other/popup.html#/approval'),
		false,
		'another extension cannot own the request'
	)
})

test('keeps Backpack failure diagnostics free of provider, account, and request material', () => {
	const accountAddress = '9xQeWvG816bUx9EPfEZLLqvRYcQdhAkZjfLHLXEbiVd'
	const intendedProvider = 'https://private-provider.example/secret/path'
	const snapshot = {
		buttonNames: ['Cancel', 'Sign'],
		headingNames: ['Sign message'],
	}
	const classification = classifyBackpackRequestSurface({
		accountAddress,
		...snapshot,
		extensionId: 'aflkmfhebedbjioipglgcbcmnbpgliof',
		intendedProvider,
		kind: 'message',
		url: 'chrome-extension://aflkmfhebedbjioipglgcbcmnbpgliof/popup.html',
		visibleText: `${intendedProvider} ${accountAddress} confidential message bytes`,
	})
	const diagnostic = JSON.stringify(backpackRequestDiagnostic({
		classification,
		snapshot,
		url: 'chrome-extension://aflkmfhebedbjioipglgcbcmnbpgliof/popup.html',
	}))

	assert.equal(classification.ownsRequest, true)
	assert.equal(diagnostic.includes(accountAddress), false)
	assert.equal(diagnostic.includes('private-provider'), false)
	assert.equal(diagnostic.includes('confidential'), false)
	assert.match(diagnostic, /"accountMatched":true/)
	assert.match(diagnostic, /"providerMatched":true/)
})

test('refuses the legacy generic Backpack approval waiter', async () => {
	await assert.rejects(
		backpackDriver.waitForApproval(),
		/phase- and identity-bound request hook/
	)
})

test('keeps the Backpack account lifecycle shard free of invented recover passes', () => {
	assert.equal(backpackDriver.kind, 'backpack')
	assert.deepEqual(backpackWalletMatrixScenarios('0.10.211').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'backpack-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'reject-retry-approve',
		},
		{
			id: 'backpack-watch-only-2',
			initializationFlow: 'watch-only',
			lifecycleEdgeCase: 'account-switch',
		},
		{
			id: 'backpack-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'fixture-material-not-provided-blocked',
		},
	])
})

test('declares Backpack recover as an explicit blocked matrix cell', async () => {
	const scenarios = backpackWalletMatrixScenarios('0.10.211').filter((scenario) => (
		scenario.lifecycleEdgeCase === 'fixture-material-not-provided-blocked'
	))
	assert.deepEqual(
		scenarios.map((scenario) => backpackBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'fixture-material-not-provided-blocked',
					detail: 'Backpack recover has no safe fixture material in unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'backpack',
				run: async (scenario) => backpackBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
		],
		'backpack recover honesty'
	)
})

test('does not upgrade Backpack unit bridge construction into request capability', async () => {
	const scenarios = backpackWalletMatrixScenarios('0.10.211')
	assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'backpack',
				run: async (scenario) => (
					scenario.initializationFlow === 'recover' ?
						backpackBlockedObservation(scenario)
					:
						{
							outcome: 'unsupported',
							evidence: {
								code: 'real-driver-required',
								detail: 'Compatibility success requires the real Backpack extension driver',
								source: 'request-construction-only',
							},
						}
				),
			},
			scenarios,
		}),
		[
			'unsupported',
			'unsupported',
			'blocked',
		],
		'backpack request-unexecuted / blocked recovery'
	)
})
