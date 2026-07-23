import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability, WalletProtocol } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { bech32, bech32m } from '@scure/base'
import { createBitcoinInjectedAdapter } from './bitcoinInjected.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type { WalletCandidate } from './types.ts'

const mainnetBase58P2pkh = '1BoatSLRHtKNngkdXEeobR76b53LETtpyT'
const mainnetBase58P2sh = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'
const testnetBase58P2pkh = 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn'
const testnetBase58P2sh = '2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc'
const mainnetWitnessV0 = 'bc1qqypqxpq9qcrsszg2pvxq6rs0zqg3yyc5fcj4z3'
const mainnetWitnessV1 = 'bc1pqypqxpq9qcrsszg2pvxq6rs0zqg3yyc5z5tpwxqergd3c8g7rusqwk0jyn'
const testnetWitnessV0 = 'tb1qqypqxpq9qcrsszg2pvxq6rs0zqg3yyc5r7fxez'
const testnetWitnessV1 = 'tb1pqypqxpq9qcrsszg2pvxq6rs0zqg3yyc5z5tpwxqergd3c8g7rusqe7ea7u'
const regtestWitnessV0 = 'bcrt1qqypqxpq9qcrsszg2pvxq6rs0zqg3yyc5phstwt'
const regtestWitnessV1 = 'bcrt1pqypqxpq9qcrsszg2pvxq6rs0zqg3yyc5z5tpwxqergd3c8g7rusq58nmtx'

describe('Bitcoin injected wallet adapter', () => {
	afterEach(() => vi.unstubAllGlobals())

	it('connects UniSat and follows account and network changes', async () => {
		const listeners = new Map<string, (payload: JsonValue) => void>()
		const removeListener = vi.fn()
		const provider = {
			requestAccounts: vi.fn(async () => [mainnetWitnessV0.toUpperCase()]),
			getAccounts: vi.fn(async () => [testnetWitnessV0]),
			getChain: vi.fn()
				.mockResolvedValueOnce({ enum: 'BITCOIN_MAINNET', name: 'Bitcoin Mainnet', network: 'livenet' })
				.mockResolvedValue({ enum: 'BITCOIN_TESTNET', name: 'Bitcoin Testnet', network: 'testnet' }),
			on: vi.fn((event: string, listener: (payload: JsonValue) => void) => listeners.set(event, listener)),
			removeListener,
		}
		vi.stubGlobal('window', { unisat: provider })
		const adapter = createBitcoinInjectedAdapter()
		const candidateUpdates: object[][] = []
		adapter.start((candidates) => candidateUpdates.push(candidates))

		expect(candidateUpdates[0][0]).toMatchObject({
			id: 'bitcoin:unisat',
			capabilities: expect.arrayContaining([
				WalletCapability.Connect,
				WalletCapability.WatchAccounts,
				WalletCapability.WatchScopes,
			]),
		})
		expect(await adapter.connect('bitcoin:unisat')).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.BitcoinInjected,
			accounts: [{
				namespace: 'bip122',
				reference: '000000000019d6689c085ae165831e93',
				accountAddress: mainnetWitnessV0,
			}],
		})

		const updates: object[] = []
		const unsubscribe = adapter.subscribeConnection('bitcoin:unisat', (connection) => updates.push(connection))
		listeners.get('accountsChanged')?.([testnetBase58P2pkh])
		await vi.waitFor(() => expect(updates.at(-1)).toMatchObject({
			accounts: [{
				reference: '000000000933ea01ad0ee984209779ba',
				accountAddress: testnetBase58P2pkh,
			}],
		}))
		listeners.get('networkChanged')?.('testnet')
		await vi.waitFor(() => expect(updates.at(-1)).toMatchObject({
			accounts: [{
				reference: '000000000933ea01ad0ee984209779ba',
				accountAddress: testnetWitnessV0,
			}],
		}))
		unsubscribe()
		expect(removeListener).toHaveBeenCalledTimes(2)
	})

	it('connects every Xverse address under its provider-supplied network and disconnects remotely', async () => {
		const listeners = new Map<string, (payload: JsonValue) => void>()
		const request = vi.fn(async (method: string) => method === 'wallet_disconnect' ?
			null
		:
			{
				status: 'success',
				result: {
					addresses: [{
						address: mainnetWitnessV1,
						purpose: 'ordinals',
						network: 'Mainnet',
					}, {
						address: testnetWitnessV0,
						purpose: 'payment',
						network: 'testnet',
					}],
				},
			})
		vi.stubGlobal('window', {
			XverseProviders: {
				BitcoinProvider: {
					request,
					addListener: (event: string, listener: (payload: JsonValue) => void) => {
						listeners.set(event, listener)
						return vi.fn()
					},
				},
			},
		})
		const adapter = createBitcoinInjectedAdapter()
		adapter.start(() => {})

		expect(await adapter.connect('bitcoin:xverse')).toMatchObject({
			protocol: WalletProtocol.SatsConnect,
			status: BlockheadConnectionStatus.Connected,
			scopes: [
				expect.objectContaining({
					reference: '000000000019d6689c085ae165831e93',
				}),
				expect.objectContaining({
					reference: '000000000933ea01ad0ee984209779ba',
				}),
			],
			accounts: [
				expect.objectContaining({
					reference: '000000000019d6689c085ae165831e93',
					accountAddress: mainnetWitnessV1,
				}),
				expect.objectContaining({
					reference: '000000000933ea01ad0ee984209779ba',
					accountAddress: testnetWitnessV0,
				}),
			],
		})
		const updates: object[] = []
		adapter.subscribeConnection('bitcoin:xverse', (connection) => updates.push(connection))
		listeners.get('accountDisconnected')?.({ type: 'accountDisconnected' })
		expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
		})
		await adapter.disconnect('bitcoin:xverse')
		expect(request).toHaveBeenLastCalledWith('wallet_disconnect', null)
	})

	it('validates, canonicalizes, and deduplicates supported address families by network', async () => {
		const request = vi.fn(async () => ({
			status: 'success',
			result: {
				addresses: [
					{
						address: mainnetBase58P2pkh,
						purpose: 'payment',
						network: 'mainnet',
					},
					{
						address: mainnetBase58P2sh,
						purpose: 'payment',
						network: 'livenet',
					},
					{
						address: mainnetWitnessV0.toUpperCase(),
						purpose: 'payment',
						network: 'mainnet',
					},
					{
						address: mainnetWitnessV0,
						purpose: 'ordinals',
						network: 'livenet',
					},
					{
						address: mainnetWitnessV1,
						purpose: 'ordinals',
						network: 'mainnet',
					},
					{
						address: testnetBase58P2pkh,
						purpose: 'payment',
						network: 'testnet',
					},
					{
						address: testnetBase58P2sh,
						purpose: 'payment',
						network: 'testnet',
					},
					{
						address: testnetWitnessV0,
						purpose: 'payment',
						network: 'testnet',
					},
					{
						address: testnetWitnessV0,
						purpose: 'payment',
						network: 'signet',
					},
					{
						address: testnetWitnessV1,
						purpose: 'ordinals',
						network: 'signet',
					},
					{
						address: testnetBase58P2pkh,
						purpose: 'payment',
						network: 'regtest',
					},
					{
						address: regtestWitnessV0,
						purpose: 'payment',
						network: 'regtest',
					},
					{
						address: regtestWitnessV1,
						purpose: 'ordinals',
						network: 'regtest',
					},
				],
			},
		}))
		vi.stubGlobal('window', {
			XverseProviders: {
				BitcoinProvider: { request },
			},
		})
		const adapter = createBitcoinInjectedAdapter()
		adapter.start(() => {})

		expect((await adapter.connect('bitcoin:xverse'))?.accounts.map((account) => ({
			reference: account.reference,
			accountAddress: account.accountAddress,
		}))).toEqual([
			{
				reference: '000000000019d6689c085ae165831e93',
				accountAddress: mainnetBase58P2pkh,
			},
			{
				reference: '000000000019d6689c085ae165831e93',
				accountAddress: mainnetBase58P2sh,
			},
			{
				reference: '000000000019d6689c085ae165831e93',
				accountAddress: mainnetWitnessV0,
			},
			{
				reference: '000000000019d6689c085ae165831e93',
				accountAddress: mainnetWitnessV1,
			},
			{
				reference: '000000000933ea01ad0ee984209779ba',
				accountAddress: testnetBase58P2pkh,
			},
			{
				reference: '000000000933ea01ad0ee984209779ba',
				accountAddress: testnetBase58P2sh,
			},
			{
				reference: '000000000933ea01ad0ee984209779ba',
				accountAddress: testnetWitnessV0,
			},
			{
				reference: '00000008819873e925422c1ff0f99f7c',
				accountAddress: testnetWitnessV0,
			},
			{
				reference: '00000008819873e925422c1ff0f99f7c',
				accountAddress: testnetWitnessV1,
			},
			{
				reference: '0f9188f13cb7b2c71f2a335e3a4fc328',
				accountAddress: testnetBase58P2pkh,
			},
			{
				reference: '0f9188f13cb7b2c71f2a335e3a4fc328',
				accountAddress: regtestWitnessV0,
			},
			{
				reference: '0f9188f13cb7b2c71f2a335e3a4fc328',
				accountAddress: regtestWitnessV1,
			},
		])
	})

	it('rejects foreign-network, checksum, encoding, version, and program violations', async () => {
		for (const {
			address,
			network,
		violation,
		} of [
			{
				violation: 'Base58Check checksum',
				address: `${mainnetBase58P2pkh.slice(0, -1)}U`,
				network: 'mainnet',
			},
			{
				violation: 'foreign Base58 version',
				address: testnetBase58P2pkh,
				network: 'mainnet',
			},
			{
				violation: 'foreign witness prefix',
				address: mainnetWitnessV0,
				network: 'testnet',
			},
			{
				violation: 'mixed Bech32 case',
				address: `${mainnetWitnessV0.slice(0, 4).toUpperCase()}${mainnetWitnessV0.slice(4)}`,
				network: 'mainnet',
			},
			{
				violation: 'leading whitespace',
				address: ` ${mainnetBase58P2pkh}`,
				network: 'mainnet',
			},
			{
				violation: 'v0 Bech32m checksum',
				address: bech32m.encode('bc', [
					0,
					...bech32m.toWords(new Uint8Array(20)),
				]),
				network: 'mainnet',
			},
			{
				violation: 'v1 Bech32 checksum',
				address: bech32.encode('bc', [
					1,
					...bech32.toWords(new Uint8Array(32)),
				]),
				network: 'mainnet',
			},
			{
				violation: 'witness version 17',
				address: bech32m.encode('bc', [
					17,
					...bech32m.toWords(new Uint8Array(32)),
				]),
				network: 'mainnet',
			},
			{
				violation: 'v0 two-byte program',
				address: bech32.encode('bc', [
					0,
					...bech32.toWords(new Uint8Array(2)),
				]),
				network: 'mainnet',
			},
			{
				violation: 'one-byte witness program',
				address: bech32m.encode('bc', [
					1,
					...bech32m.toWords(new Uint8Array(1)),
				]),
				network: 'mainnet',
			},
			{
				violation: '41-byte witness program',
				address: bech32m.encode(
					'bc',
					[
						1,
						...bech32m.toWords(new Uint8Array(41)),
					],
					false
				),
				network: 'mainnet',
			},
			{
				violation: 'non-canonical witness padding',
				address: bech32m.encode('bc', [
					1,
					1,
				]),
				network: 'mainnet',
			},
		]) {
			const request = vi.fn(async () => ({
				status: 'success',
				result: {
					addresses: [{
						address,
						purpose: 'payment',
						network,
					}],
				},
			}))
			vi.stubGlobal('window', {
				XverseProviders: {
					BitcoinProvider: { request },
				},
			})
			const adapter = createBitcoinInjectedAdapter()
			adapter.start(() => {})

			await expect(
				adapter.connect('bitcoin:xverse'),
				violation
			).rejects.toThrow(`Bitcoin wallet returned an invalid ${network} address`)
			vi.unstubAllGlobals()
		}
	})

	it('does not publish invalid restore or account-event identities and recovers on a valid event', async () => {
		const listeners = new Map<string, (payload: JsonValue) => void>()
		const provider = {
			requestAccounts: vi.fn(async () => [mainnetWitnessV0]),
			getAccounts: vi.fn(async () => [mainnetWitnessV0]),
			getChain: vi.fn(async () => ({
				enum: 'BITCOIN_TESTNET',
				name: 'Bitcoin Testnet',
				network: 'testnet',
			})),
			on: vi.fn((event: string, listener: (payload: JsonValue) => void) => listeners.set(event, listener)),
			removeListener: vi.fn(),
		}
		vi.stubGlobal('window', { unisat: provider })
		const adapter = createBitcoinInjectedAdapter()
		const updates: object[] = []
		adapter.start(() => {})
		adapter.subscribeConnection('bitcoin:unisat', (connection) => updates.push(connection))
		await vi.waitFor(() => expect(provider.getAccounts).toHaveBeenCalled())
		await Promise.resolve()
		expect(updates).toEqual([])

		listeners.get('accountsChanged')?.([mainnetBase58P2pkh])
		await Promise.resolve()
		expect(updates).toEqual([])

		listeners.get('accountsChanged')?.([testnetWitnessV0])
		await vi.waitFor(() => expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			accounts: [{
				reference: '000000000933ea01ad0ee984209779ba',
				accountAddress: testnetWitnessV0,
			}],
		}))
	})

	it('discovers Leather, Xverse, UniSat, and discovery-only Magic Eden truthfully', () => {
		const request = vi.fn(async () => ({
			status: 'success',
			result: {
				addresses: [],
			},
		}))
		vi.stubGlobal('window', {
			LeatherProvider: { request },
			magicEden: { bitcoin: {} },
			unisat: {
				requestAccounts: vi.fn(),
				getAccounts: vi.fn(),
				getChain: vi.fn(),
				on: vi.fn(),
				removeListener: vi.fn(),
			},
			XverseProviders: {
				BitcoinProvider: {
					request,
				},
			},
		})
		const updates: WalletCandidate[][] = []
		createBitcoinInjectedAdapter().start((candidates) => updates.push(candidates))

		expect(updates[0].map(({ id }) => id)).toEqual([
			'bitcoin:leather',
			'bitcoin:xverse',
			'bitcoin:unisat',
			'bitcoin:magiceden',
		])
	})

	it('preserves provider approval and remote disconnect rejection', async () => {
		const approvalRejection = new Error('User rejected Bitcoin access')
		const disconnectRejection = new Error('Wallet rejected disconnect')
		const request = vi.fn()
			.mockRejectedValueOnce(approvalRejection)
			.mockRejectedValueOnce(disconnectRejection)
		vi.stubGlobal('window', {
			XverseProviders: {
				BitcoinProvider: { request },
			},
		})
		const adapter = createBitcoinInjectedAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('bitcoin:xverse')).rejects.toBe(approvalRejection)
		await expect(adapter.disconnect('bitcoin:xverse')).rejects.toBe(disconnectRejection)
	})

	it('cancels a stale cold restore after a newer account event and removes listeners', async () => {
		const restoreAccounts = Promise.withResolvers<JsonValue>()
		const listeners = new Map<string, (payload: JsonValue) => void>()
		const removeListener = vi.fn((event: string) => listeners.delete(event))
		const provider = {
			requestAccounts: vi.fn(),
			getAccounts: vi.fn(() => restoreAccounts.promise),
			getChain: vi.fn(async () => ({
				enum: 'BITCOIN_TESTNET',
				name: 'Bitcoin Testnet',
				network: 'testnet',
			})),
			on: vi.fn((event: string, listener: (payload: JsonValue) => void) => listeners.set(event, listener)),
			removeListener,
		}
		vi.stubGlobal('window', { unisat: provider })
		const adapter = createBitcoinInjectedAdapter()
		const updates: object[] = []
		adapter.start(() => {})
		const unsubscribe = adapter.subscribeConnection(
			'bitcoin:unisat',
			(connection) => updates.push(connection)
		)
		listeners.get('accountsChanged')?.([testnetWitnessV1])
		await vi.waitFor(() => expect(updates.at(-1)).toMatchObject({
			accounts: [{ accountAddress: testnetWitnessV1 }],
		}))
		restoreAccounts.resolve([testnetWitnessV0])
		await restoreAccounts.promise
		await Promise.resolve()

		expect(updates).toHaveLength(1)
		unsubscribe()
		expect(removeListener).toHaveBeenCalledTimes(2)
	})

	it('keeps discovery-only wallets honest', () => {
		vi.stubGlobal('window', {
			magicEden: { bitcoin: {} },
			XverseProviders: {},
		})
		const updates: object[][] = []
		createBitcoinInjectedAdapter().start((candidates) => updates.push(candidates))

		expect(updates[0]).toEqual(expect.arrayContaining([
			expect.objectContaining({ id: 'bitcoin:xverse', capabilities: [WalletCapability.Discover] }),
			expect.objectContaining({ id: 'bitcoin:magiceden', capabilities: [WalletCapability.Discover] }),
		]))
	})
})
