import assert from 'node:assert/strict'
import { delimiter, resolve } from 'node:path'
import test from 'node:test'

import {
	classifyWallet,
	createEphemeralWalletSecret,
	exerciseWalletSigningRequest,
	extensionIdForManifest,
	parseExtensionDirectories,
	resolveWalletExtensionDirectories,
	type WalletSigningPersistenceObservation,
	type WalletSigningTestContract,
	type WalletTestRequest,
	type WalletTestRequestMetadata,
} from './WalletExtensionHarness.ts'
import { WalletHarnessEcosystem } from './ecosystems.ts'
import {
	personalSigningAccount,
	personalSigningMessage,
	personalSigningSignature,
} from './personalSigning.fixtures.ts'
import { permitAccount, permitOtherSignerSignature, permitSignature, permitTypedData } from './typedDataSigning.fixtures.ts'


test('parses platform-delimited extension directories', () => {
	assert.deepEqual(parseExtensionDirectories(`/one${delimiter}/two`), [
		'/one',
		'/two',
	])
	assert.deepEqual(parseExtensionDirectories(undefined), [])
})

test('resolves named extension env dirs before the fixture fallback', () => {
	assert.deepEqual(resolveWalletExtensionDirectories({
		environment: { METAMASK_EXTENSION_DIR: '/tmp/blockhead-wallet-metamask' },
		fixtureDirectory: '/tmp/fixture',
	}), [resolve('/tmp/blockhead-wallet-metamask')])
	assert.deepEqual(resolveWalletExtensionDirectories({
		environment: {
			WALLET_EXTENSION_DIRS: `/tmp/one${delimiter}/tmp/two`,
			METAMASK_EXTENSION_DIR: '/tmp/must-not-load',
		},
		fixtureDirectory: '/tmp/fixture',
	}), [resolve('/tmp/one'), resolve('/tmp/two')])
	assert.deepEqual(resolveWalletExtensionDirectories({
		environment: {},
		fixtureDirectory: '/tmp/fixture',
	}), [resolve('/tmp/fixture')])
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
	assert.equal(classifyWallet(manifest('Lace')), 'lace')
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
			ecosystem: WalletHarnessEcosystem.Evm,
			kind: 'message',
			method: 'personal_sign',
			accountAddress: personalSigningAccount,
			chainId: 'eip155:1',
			params: [
				personalSigningMessage,
				personalSigningAccount,
			],
		},
		{
			ecosystem: WalletHarnessEcosystem.Evm,
			kind: 'typed-data',
			method: 'eth_signTypedData_v4',
			accountAddress: permitAccount,
			chainId: 'eip155:1',
			params: [
				permitAccount,
				JSON.stringify(permitTypedData),
			],
		},
	] as const satisfies readonly WalletTestRequest[]) {
		const metadata: WalletTestRequestMetadata[] = []
		const result = await exerciseWalletSigningRequest({
			contract: {
				provider: {
					request: async () => request.kind === 'typed-data' ? permitSignature : personalSigningSignature,
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

test('rejects personal-sign approval for another message, signer, request account, or malformed response', async () => {
	for (const { message, account, selectedAccount, signature } of [
		{ message: '0xdeadbeef' },
		{ selectedAccount: '0x2222222222222222222222222222222222222222', account: '0x2222222222222222222222222222222222222222' },
		{ account: '0x2222222222222222222222222222222222222222' },
		{ signature: '0xsigned' },
	]) {
		await assert.rejects(exerciseWalletSigningRequest({
			contract: {
				provider: { request: async () => signature ?? personalSigningSignature },
				driver: {
					waitForRequest: async () => {},
					approve: async () => {},
					reject: async () => { throw new Error('unexpected rejection') },
				},
				observePersistence: () => ({ evmTransactionIds: [] }),
			},
			request: {
				ecosystem: WalletHarnessEcosystem.Evm,
				kind: 'message',
				method: 'personal_sign',
				accountAddress: selectedAccount ?? personalSigningAccount,
				params: [message ?? personalSigningMessage, account ?? personalSigningAccount],
			},
			decision: 'approve',
		}), /does not verify against the requested message and account/)
	}
})

test('rejects EIP-712 approval for changed domain, message, signer, or requested account', async () => {
	for (const { data = permitTypedData, account = permitAccount, signature = permitSignature } of [
		{ data: { ...permitTypedData, domain: { ...permitTypedData.domain, chainId: 2 } } },
		{ data: { ...permitTypedData, message: { ...permitTypedData.message, value: '2000000000000000000' } } },
		{ signature: permitOtherSignerSignature },
		{ account: '0x2222222222222222222222222222222222222222' },
	])
		await assert.rejects(exerciseWalletSigningRequest({
			contract: {
				provider: { request: async () => signature },
				driver: {
					waitForRequest: async () => {},
					approve: async () => {},
					reject: async () => { throw new Error('unexpected rejection') },
				},
				observePersistence: () => ({ evmTransactionIds: [] }),
			},
			request: {
				ecosystem: WalletHarnessEcosystem.Evm,
				kind: 'typed-data',
				method: 'eth_signTypedData_v4',
				accountAddress: permitAccount,
				params: [account, JSON.stringify(data)],
			},
			decision: 'approve',
		}), /does not verify against the requested typed data and account/)
})

test('refuses unqualified typed-data approval methods before asking the wallet', async () => {
	let calls = 0
	for (const method of ['eth_signTypedData', 'eth_signTypedData_v3'] as const)
		await assert.rejects(exerciseWalletSigningRequest({
			contract: {
				provider: { request: async () => { calls++; return permitSignature } },
				driver: {
					waitForRequest: async () => {},
					approve: async () => {},
					reject: async () => {},
				},
				observePersistence: () => ({ evmTransactionIds: [] }),
			},
			request: {
				ecosystem: WalletHarnessEcosystem.Evm,
				kind: 'typed-data',
				method,
				accountAddress: permitAccount,
				params: [permitAccount, JSON.stringify(permitTypedData)],
			},
			decision: 'approve',
		}), /older typed-data methods are not qualified/)
	assert.equal(calls, 0)
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
			ecosystem: WalletHarnessEcosystem.Evm,
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

test('arms wallet request observation before invoking the provider', async () => {
	let observationArmed = false
	await exerciseWalletSigningRequest({
		contract: {
			provider: {
				request: async () => {
					assert.equal(observationArmed, true)
					throw new Error('User rejected the request')
				},
			},
			driver: {
				waitForRequest: async () => {
					observationArmed = true
				},
				approve: async () => {},
				reject: async () => {},
			},
			observePersistence: () => ({ evmTransactionIds: [] }),
		},
		request: {
			ecosystem: WalletHarnessEcosystem.Evm,
			kind: 'transaction',
			method: 'eth_sendTransaction',
			accountAddress: '0x1111111111111111111111111111111111111111',
			chainId: 'eip155:1',
			params: [],
		},
		decision: 'reject',
	})
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
		ecosystem: WalletHarnessEcosystem.Evm,
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
