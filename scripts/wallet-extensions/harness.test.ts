import assert from 'node:assert/strict'
import { delimiter } from 'node:path'
import test from 'node:test'

import {
	classifyWallet,
	createEphemeralWalletSecret,
	exerciseWalletSigningRequest,
	extensionIdForManifest,
	parseExtensionDirectories,
	type WalletSigningPersistenceObservation,
	type WalletSigningTestContract,
	type WalletTestRequest,
	type WalletTestRequestMetadata,
} from './harness.ts'


test('parses platform-delimited extension directories', () => {
	assert.deepEqual(parseExtensionDirectories(`/one${delimiter}/two`), [
		'/one',
		'/two',
	])
	assert.deepEqual(parseExtensionDirectories(undefined), [])
})

test('classifies supported wallets without treating the fixture as real', () => {
	const manifest = (name: string) => ({
		background: {
			service_worker: 'background.js',
		},
		manifest_version: 3 as const,
		name,
		version: '1.0.0',
	})

	assert.equal(classifyWallet(manifest('MetaMask')), 'metamask')
	assert.equal(classifyWallet(manifest('Rabby Wallet')), 'rabby')
	assert.equal(classifyWallet(manifest('Ambire Wallet')), 'ambire')
	assert.equal(classifyWallet(manifest('Argent X - Starknet Wallet')), 'argent-x')
	assert.equal(classifyWallet(manifest('Backpack')), 'backpack')
	assert.equal(classifyWallet(manifest('Keplr')), 'keplr')
	assert.equal(classifyWallet(manifest('Petra Aptos Wallet')), 'petra')
	assert.equal(classifyWallet(manifest('polkadot{.js} extension')), 'polkadot-js')
	assert.equal(classifyWallet(manifest('Taho')), 'taho')
	assert.equal(classifyWallet(manifest('Tonkeeper')), 'tonkeeper')
	assert.equal(classifyWallet(manifest('UniSat Wallet')), 'unisat')
	assert.equal(classifyWallet(manifest('Zerion Wallet')), 'zerion')
	assert.equal(classifyWallet(manifest('Blockhead Wallet Harness Fixture')), 'harness-only')
	assert.equal(classifyWallet(manifest('Unknown Wallet')), 'unknown')
	assert.equal(classifyWallet({
		...manifest('__MSG_appName__'),
		action: {
			default_title: 'Zerion',
		},
	}), 'zerion')
	assert.equal(classifyWallet({
		...manifest('__MSG_appName__'),
		author: 'https://unisat.io',
	}), 'unisat')
	assert.equal(classifyWallet({
		...manifest('__MSG_appTitle__'),
		action: {
			default_popup: 'index.html?source=default_popup',
		},
	}), 'tonkeeper')
})

test('derives stable Chromium extension identities from manifest keys or canonical paths', () => {
	const manifest = {
		background: {
			service_worker: 'background.js',
		},
		manifest_version: 3 as const,
		name: 'Wallet',
		version: '1.0.0',
	}

	assert.match(extensionIdForManifest(manifest, '/wallet'), /^[a-p]{32}$/)
	assert.equal(extensionIdForManifest(manifest, '/wallet'), extensionIdForManifest(manifest, '/wallet'))
	assert.notEqual(extensionIdForManifest(manifest, '/wallet'), extensionIdForManifest(manifest, '/other-wallet'))
	assert.equal(
		extensionIdForManifest({
			...manifest,
			key: Buffer.from('stable-key').toString('base64'),
		}, '/wallet'),
		extensionIdForManifest({
			...manifest,
			key: Buffer.from('stable-key').toString('base64'),
		}, '/other-wallet')
	)
})

test('creates non-reusable ephemeral onboarding secrets without exposing recovery material', () => {
	const first = createEphemeralWalletSecret('Wallet-')
	const second = createEphemeralWalletSecret('Wallet-')

	assert.match(first, /^Wallet-[A-Za-z0-9_-]{32}$/)
	assert.notEqual(first, second)
})

test('captures safe metadata for message and typed-data approvals', async () => {
	for (const request of [
		{
			kind: 'message',
			method: 'personal_sign',
			accountAddress: '0x1111111111111111111111111111111111111111',
			chainId: 'eip155:1',
			params: [
				'private test message',
				'0x1111111111111111111111111111111111111111',
			],
		},
		{
			kind: 'typed-data',
			method: 'eth_signTypedData_v4',
			accountAddress: '0x1111111111111111111111111111111111111111',
			chainId: 'eip155:1',
			params: [
				'0x1111111111111111111111111111111111111111',
				'{"domain":{"name":"private test domain"},"message":{"secret":"not metadata"}}',
			],
		},
	] as const satisfies readonly WalletTestRequest[]) {
		const metadata: WalletTestRequestMetadata[] = []
		const result = await exerciseWalletSigningRequest({
			contract: {
				provider: {
					request: async () => '0xsigned',
				},
				driver: {
					waitForRequest: async (requestMetadata) => {
						metadata.push(requestMetadata)
					},
					approve: async () => {},
					reject: async () => {
						throw new Error('unexpected rejection')
					},
				},
				observePersistence: () => ({
					evmTransactionIds: [],
				}),
			},
			request,
			decision: 'approve',
		})

		assert.equal(result.decision, 'approve')
		assert.equal(result.metadata.kind, request.kind)
		assert.equal(metadata.length, 1)
		assert.match(result.metadata.paramsHash, /^sha256:[0-9a-f]{64}$/)
		assert.equal(JSON.stringify(result.metadata).includes('private test'), false)
		assert.equal(JSON.stringify(result.metadata).includes('secret'), false)
	}
})

test('drives explicit rejection without submission or EvmTransaction persistence', async () => {
	let rejectProvider: ((error: Error) => void) | undefined
	let rejected = false
	const result = await exerciseWalletSigningRequest({
		contract: {
			provider: {
				request: () => new Promise((_, reject) => {
					rejectProvider = reject
				}),
			},
			driver: {
				waitForRequest: async () => {},
				approve: async () => {
					throw new Error('unexpected approval')
				},
				reject: async () => {
					rejected = true
					rejectProvider?.(new Error('User rejected the request'))
				},
			},
			observePersistence: () => ({
				evmTransactionIds: [],
			}),
		},
		request: {
			kind: 'transaction',
			method: 'eth_sendTransaction',
			accountAddress: '0x1111111111111111111111111111111111111111',
			chainId: 'eip155:1',
			params: [{
				from: '0x1111111111111111111111111111111111111111',
				to: '0x2222222222222222222222222222222222222222',
				value: '0x1',
			}],
		},
		decision: 'reject',
	})

	assert.equal(rejected, true)
	assert.equal(result.decision, 'reject')
	if (result.decision === 'reject')
		assert.match(String(result.error), /User rejected/)
})

test('permits transaction persistence only after a real provider hash', async () => {
	const transactionHash = `0x${'ab'.repeat(32)}`
	let persistence: WalletSigningPersistenceObservation = {
		evmTransactionIds: [],
	}
	let providerResolved = false
	const contract: WalletSigningTestContract = {
		provider: {
			request: async () => {
				providerResolved = true
				return transactionHash
			},
		},
		driver: {
			waitForRequest: async () => {},
			approve: async () => {},
			reject: async () => {
				throw new Error('unexpected rejection')
			},
		},
		observePersistence: () => persistence,
		onTransactionHash: (hash) => {
			assert.equal(providerResolved, true)
			assert.equal(hash, transactionHash)
			persistence = {
				submittedAt: 1,
				evmTransactionIds: [hash],
			}
		},
	}
	const request = {
		kind: 'transaction',
		method: 'eth_sendTransaction',
		accountAddress: '0x1111111111111111111111111111111111111111',
		chainId: 'eip155:1',
		params: [{
			from: '0x1111111111111111111111111111111111111111',
			to: '0x2222222222222222222222222222222222222222',
		}],
	} as const satisfies WalletTestRequest

	const result = await exerciseWalletSigningRequest({
		contract,
		request,
		decision: 'approve',
	})
	assert.equal(result.decision, 'approve')
	assert.deepEqual(persistence, {
		submittedAt: 1,
		evmTransactionIds: [transactionHash],
	})

	await assert.rejects(() => exerciseWalletSigningRequest({
		contract: {
			...contract,
			provider: {
				request: async () => '0xnot-a-transaction-hash',
			},
			observePersistence: () => ({
				evmTransactionIds: [],
			}),
		},
		request,
		decision: 'approve',
	}), /real transaction hash/)
})
