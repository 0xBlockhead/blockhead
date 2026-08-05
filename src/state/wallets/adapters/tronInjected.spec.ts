import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability, WalletDiscoveryKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { createTronInjectedAdapter } from './tronInjected.ts'
import type { WalletCandidate, WalletConnection } from './types.ts'

const firstAddress = 'TZ5XixnRyraxJJy996Q1sip85PHWuj4793'
const secondAddress = 'TRKb2nAnCBfwxnLxgoKJro6VbyA6QmsuXq'
const firstHexAddress = '41fd7d047d1164aad0f6c1ea4966449cd2e34df696'
const wrongVersionAddress = 'TZQ7s7Wkv2SyN5pgpJ7AMdTsXyvYLbktsg'

const setup = () => {
	const windowListeners = new Map<string, (event: CustomEvent) => void>()
	const providerListeners = new Map<string, (payload: JsonValue) => void>()
	let accounts = [firstAddress]
	let reference = '0x2b6653dc'
	const provider = {
		request: vi.fn(async ({ method }: { method: string }) => (
			method === 'eth_chainId' ? reference : accounts
		)),
		on: (event: string, listener: (payload: JsonValue) => void) => {
			providerListeners.set(event, listener)
		},
		removeListener: (event: string) => {
			providerListeners.delete(event)
		},
	}
	vi.stubGlobal('window', {
		addEventListener: (event: string, listener: (event: CustomEvent) => void) => {
			windowListeners.set(event, listener)
		},
		removeEventListener: (event: string) => {
			windowListeners.delete(event)
		},
		dispatchEvent: () => true,
		setTimeout,
		clearTimeout,
	})

	return {
		announce: (uuid = 'tronlink') => windowListeners.get('TIP6963:announceProvider')?.(new CustomEvent(
			'TIP6963:announceProvider',
			{
				detail: {
					info: {
						uuid,
						name: 'TronLink',
						icon: 'data:image/svg+xml,<svg/>',
						rdns: 'org.tronlink.wallet',
					},
					provider,
				},
			}
		)),
		provider,
		providerListeners,
		setAccounts: (nextAccounts: string[]) => {
			accounts = nextAccounts
		},
		setReference: (nextReference: string) => {
			reference = nextReference
		},
		windowListeners,
	}
}

describe('TRON TIP-6963/TIP-1193 adapter', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('discovers providers announced before or after the request with UUID identity', () => {
		const { announce, windowListeners } = setup()
		const candidates: WalletCandidate[][] = []
		const stop = createTronInjectedAdapter().start((nextCandidates) => candidates.push(nextCandidates))
		announce('wallet-a')
		announce('wallet-b')

		expect(candidates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'tron-tip6963:wallet-a',
				rdns: 'org.tronlink.wallet',
				discoveryKind: WalletDiscoveryKind.InjectedEvent,
			}),
			expect.objectContaining({
				id: 'tron-tip6963:wallet-b',
			}),
		])

		stop()
		expect(windowListeners.has('TIP6963:announceProvider')).toBe(false)
	})

	it('keeps discovery passive until explicit connection authority', async () => {
		const {
			announce,
			provider,
			providerListeners,
		} = setup()
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start(() => {})
		announce()

		expect(provider.request).not.toHaveBeenCalled()
		expect(providerListeners.size).toBe(0)

		await adapter.connect('tron-tip6963:tronlink')
		expect(provider.request).toHaveBeenNthCalledWith(1, {
			method: 'eth_requestAccounts',
			params: [],
		})

		stop()
	})

	it('connects multiple accounts with exact TRON CAIP scope and advertised signing capabilities', async () => {
		const { announce, provider, setAccounts } = setup()
		const candidates: WalletCandidate[][] = []
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start((nextCandidates) => candidates.push(nextCandidates))
		announce()
		setAccounts([
			firstAddress,
			firstAddress,
			secondAddress,
		])

		expect(candidates.at(-1)?.[0]?.capabilities).toEqual([
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
		])
		const connection = await adapter.connect('tron-tip6963:tronlink')
		expect(provider.request).toHaveBeenNthCalledWith(1, {
			method: 'eth_requestAccounts',
			params: [],
		})
		expect(connection).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Connected,
			scopes: [expect.objectContaining({
				namespace: 'tron',
				reference: '0x2b6653dc',
				methods: expect.arrayContaining([
					'personal_sign',
					'eth_signTransaction',
					'eth_sendTransaction',
				]),
			})],
			accounts: [
				expect.objectContaining({
					namespace: 'tron',
					reference: '0x2b6653dc',
					accountAddress: firstAddress,
				}),
				expect.objectContaining({
					namespace: 'tron',
					reference: '0x2b6653dc',
					accountAddress: secondAddress,
				}),
			],
			activeAccount: expect.objectContaining({
				accountAddress: firstAddress,
			}),
		}))
		stop()
	})

	it('preserves provider approval rejection and rejects non-canonical scope data', async () => {
		const { announce, provider, setReference } = setup()
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start(() => {})
		announce()
		provider.request.mockRejectedValueOnce(Object.assign(new Error('User Rejected Request'), { code: 4001 }))

		await expect(adapter.connect('tron-tip6963:tronlink')).rejects.toMatchObject({
			code: 4001,
			message: 'User Rejected Request',
		})
		setReference('0X2B6653DC')
		await expect(adapter.connect('tron-tip6963:tronlink')).rejects.toThrow('canonical chain ID')
		for (const reference of [
			'0x0',
			'0x00',
			'0x02b6653dc',
			'0X2b6653dc',
		]) {
			setReference(reference)
			await expect(adapter.connect('tron-tip6963:tronlink')).rejects.toThrow('canonical chain ID')
		}
		stop()
	})

	it('preserves rejection and retries only through a new explicit connection request', async () => {
		const { announce, provider } = setup()
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start(() => {})
		announce()
		provider.request.mockRejectedValueOnce(Object.assign(new Error('User Rejected Request'), { code: 4001 }))

		await expect(adapter.connect('tron-tip6963:tronlink')).rejects.toMatchObject({
			code: 4001,
			message: 'User Rejected Request',
		})
		expect(provider.request).toHaveBeenCalledTimes(1)
		await expect(adapter.connect('tron-tip6963:tronlink')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			accounts: [expect.objectContaining({ accountAddress: firstAddress })],
		})
		expect(provider.request).toHaveBeenNthCalledWith(2, {
			method: 'eth_requestAccounts',
			params: [],
		})

		stop()
	})

	it.each([
		`${firstAddress.slice(0, -1)}2`,
		wrongVersionAddress,
		firstHexAddress,
		firstAddress.toLowerCase(),
		`1${firstAddress}`,
		`${firstAddress} `,
		'TRON0OIl',
	])('rejects checksum-invalid, wrong-version, hex, or malformed account %s', async (accountAddress) => {
		const { announce, setAccounts } = setup()
		setAccounts([accountAddress])
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start(() => {})
		announce()

		await expect(adapter.connect('tron-tip6963:tronlink')).rejects.toThrow(
			'TRON wallet returned a non-canonical account address'
		)

		stop()
	})

	it('rejects malformed restored and changed accounts before publishing account identity', async () => {
		const {
			announce,
			provider,
			providerListeners,
			setAccounts,
		} = setup()
		setAccounts([wrongVersionAddress])
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start(() => {})
		announce()
		const connections: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'tron-tip6963:tronlink',
			(connection) => connections.push(connection)
		)

		await vi.waitFor(() => {
			expect(provider.request).toHaveBeenCalledWith({
				method: 'eth_accounts',
				params: [],
			})
		})
		await Promise.resolve()
		expect(connections).toEqual([])

		expect(() => providerListeners.get('accountsChanged')?.([
			`${firstAddress.slice(0, -1)}2`,
		])).not.toThrow()
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Error,
			accounts: [],
			error: expect.stringContaining('TRON wallet returned a non-canonical account address'),
		}))

		providerListeners.get('accountsChanged')?.([
			firstAddress,
			firstAddress,
			secondAddress,
		])
		await vi.waitFor(() => {
			expect(connections.at(-1)?.accounts).toEqual([
				expect.objectContaining({
					accountAddress: firstAddress,
				}),
				expect.objectContaining({
					accountAddress: secondAddress,
				}),
			])
		})

		unsubscribe()
		stop()
	})

	it('normalizes scalar and legacy account, chain, connect, and disconnect events', async () => {
		const { announce, providerListeners, setAccounts } = setup()
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start(() => {})
		announce()
		await adapter.connect('tron-tip6963:tronlink')
		const connections: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'tron-tip6963:tronlink',
			(connection) => connections.push(connection)
		)

		providerListeners.get('accountsChanged')?.({
			message: {
				action: 'accountsChanged',
				data: {
					address: secondAddress,
				},
			},
			isTronLink: true,
		})
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Connected,
			accounts: [expect.objectContaining({ accountAddress: secondAddress })],
		}))
		expect(() => providerListeners.get('chainChanged')?.('0x00')).not.toThrow()
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Error,
			accounts: [],
			error: expect.stringContaining('TRON wallet did not expose a canonical chain ID'),
		}))
		providerListeners.get('chainChanged')?.('0xcd8690dc')
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			scopes: [expect.objectContaining({ reference: '0xcd8690dc' })],
			accounts: [expect.objectContaining({
				reference: '0xcd8690dc',
				accountAddress: secondAddress,
			})],
		}))
		providerListeners.get('disconnect')?.({
			code: 4900,
			message: 'Disconnected',
		})
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
		}))
		setAccounts([firstAddress])
		providerListeners.get('connect')?.({
			message: {
				action: 'connect',
			},
			isTronLink: true,
		})
		await vi.waitFor(() => {
			expect(connections.at(-1)).toEqual(expect.objectContaining({
				status: BlockheadConnectionStatus.Connected,
				accounts: [expect.objectContaining({ accountAddress: firstAddress })],
			}))
		})
		providerListeners.get('accountsChanged')?.([])
		expect(connections.at(-1)?.status).toBe(BlockheadConnectionStatus.Disconnected)

		unsubscribe()
		expect(providerListeners.size).toBe(0)
		stop()
	})

	it('hydrates an existing authorization and treats local disconnect as local-only', async () => {
		const { announce, provider } = setup()
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start(() => {})
		announce()
		const connections: WalletConnection[] = []
		adapter.subscribeConnection(
			'tron-tip6963:tronlink',
			(connection) => connections.push(connection)
		)
		await vi.waitFor(() => {
			expect(connections.at(-1)?.accounts[0]?.accountAddress).toBe(firstAddress)
		})
		adapter.disconnect('tron-tip6963:tronlink')
		expect(provider.request).not.toHaveBeenCalledWith(expect.objectContaining({
			method: 'disconnect',
		}))
		stop()
	})

	it('cancels a stale cold restore after a newer chain event and cleans up listeners', async () => {
		const { announce, provider, providerListeners } = setup()
		const restoreAccounts = Promise.withResolvers<JsonValue>()
		provider.request.mockImplementation(({ method }) => (
			method === 'eth_accounts' ?
				restoreAccounts.promise
			:
				Promise.resolve('0x2b6653dc')
		))
		const adapter = createTronInjectedAdapter()
		const stop = adapter.start(() => {})
		announce()
		const connections: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'tron-tip6963:tronlink',
			(connection) => connections.push(connection)
		)
		providerListeners.get('chainChanged')?.({
			chainId: '0xcd8690dc',
		})
		restoreAccounts.resolve([firstAddress])
		await restoreAccounts.promise
		await Promise.resolve()

		expect(connections).toEqual([
			expect.objectContaining({
				scopes: [expect.objectContaining({ reference: '0xcd8690dc' })],
			}),
		])

		unsubscribe()
		expect(providerListeners.size).toBe(0)
		stop()
	})

	it('advertises SignMessage and signs via personal_sign when connected', async () => {
		const { announce, provider } = setup()
		provider.request.mockImplementation(async ({ method, params }) => {
			if (method === 'personal_sign')
				return '0xsigned'

			if (method === 'eth_chainId')
				return '0x2b6653dc'

			return [firstAddress]
		})
		const adapter = createTronInjectedAdapter()
		adapter.start(() => {})
		announce()

		const connection = await adapter.connect('tron-tip6963:tronlink')
		expect(connection?.accounts[0]?.capabilities).toContain(WalletCapability.SignMessage)
		expect(connection?.scopes[0]?.methods).toContain('personal_sign')
		expect(connection?.scopes[0]?.methods).toContain('eth_signTransaction')
		expect(connection?.accounts[0]?.capabilities).toContain(WalletCapability.SignTransaction)

		await expect(adapter.signMessage?.(
			'tron-tip6963:tronlink',
			firstAddress,
			'Sign this TRON challenge'
		)).resolves.toBe('0xsigned')
		expect(provider.request).toHaveBeenCalledWith({
			method: 'personal_sign',
			params: [
				expect.stringMatching(/^0x/),
				firstAddress,
			],
		})
	})
})
