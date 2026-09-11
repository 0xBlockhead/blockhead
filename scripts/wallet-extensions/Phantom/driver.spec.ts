import assert from 'node:assert/strict'
import test from 'node:test'
import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'
import { isPhantomExtensionPageUrl, isPhantomWalletStandardIdentity, verifyPhantomSignMessageOutput } from './driver.ts'
import { phantomWalletMatrixScenarios } from './matrix.ts'

test('verifies Phantom signMessage against the exact account and message', () => {
	const privateKey = new Uint8Array(32).fill(17)
	const publicKey = ed25519.getPublicKey(privateKey)
	const wallet = { name: 'Phantom', icon: 'data:image/svg+xml,', chains: ['solana:mainnet'], features: { 'standard:connect': {}, 'solana:signMessage': {} }, accounts: [{ address: base58.encode(publicKey), chains: ['solana:mainnet'], features: ['solana:signMessage'], publicKey }] }
	const message = new TextEncoder().encode('Blockhead Phantom exact challenge')
	const signature = ed25519.sign(message, privateKey)
	assert.equal(isPhantomWalletStandardIdentity(wallet), true)
	assert.deepEqual(verifyPhantomSignMessageOutput({ accountAddress: wallet.accounts[0].address, message, outputs: [{ signature }], wallet }), signature)
	assert.throws(() => verifyPhantomSignMessageOutput({ accountAddress: wallet.accounts[0].address, message: new TextEncoder().encode('mutated'), outputs: [{ signature }], wallet }), /does not bind/)
})

test('binds Phantom approval observation to the loaded extension origin', () => {
	const extensionId = 'bfnaelmomeimhlpmgjnjophhpkkoljpa'
	assert.equal(isPhantomExtensionPageUrl(`chrome-extension://${extensionId}/notification.html`, extensionId), true)
	assert.equal(isPhantomExtensionPageUrl(`chrome-extension://${extensionId}/notification.html#approval`, extensionId), true)
	assert.equal(isPhantomExtensionPageUrl(`chrome-extension://other/notification.html`, extensionId), false)
	assert.equal(isPhantomExtensionPageUrl('https://phantom.app/notification.html', extensionId), false)
	assert.equal(isPhantomExtensionPageUrl(`chrome-extension://${extensionId}/`, extensionId), false)
})

test('keeps Phantom on the three-cell Solana denominator', () => {
	const scenarios = phantomWalletMatrixScenarios('public-source')
	assert.equal(scenarios.length, 3)
	assert.deepEqual(scenarios.map(({ accountOrdinal }) => accountOrdinal), [1, 2, 3])
	assert.ok(scenarios.every(({ ecosystem, chain, connectionProtocol }) => (
		ecosystem === 'solana' && chain === 'solana:mainnet' && connectionProtocol === 'wallet-standard'
	)))
	assert.equal(scenarios[2].lifecycleEdgeCase, 'fixture-material-not-provided-unavailable')
})
