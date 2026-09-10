import assert from 'node:assert/strict'
import test from 'node:test'
import { ed25519 } from '@noble/curves/ed25519.js'
import { base58 } from '@scure/base'
import { isPhantomWalletStandardIdentity, verifyPhantomSignMessageOutput } from './driver.ts'

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
