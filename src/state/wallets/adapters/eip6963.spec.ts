import { afterEach, describe, expect, it, vi } from 'vitest'

import { createEip6963Adapter, type Eip6963ProviderDetail } from './eip6963.ts'
import type { Eip1193Provider } from './eip1193.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const startAdapter = (provider: Eip1193Provider) => {
	const eventListeners = new Map<string, (event: { detail: Eip6963ProviderDetail }) => void>()
	const providerListeners = new Map<string, (payload: JsonValue) => void>()
	vi.stubGlobal('window', {
		addEventListener: (event: string, listener: (event: { detail: Eip6963ProviderDetail }) => void) => {
			eventListeners.set(event, listener)
		},
		removeEventListener: (event: string) => eventListeners.delete(event),
		dispatchEvent: () => true,
		setTimeout,
		clearTimeout,
	})
	provider.on = (event, listener) => providerListeners.set(event, listener)
	provider.removeListener = (event) => providerListeners.delete(event)

	const adapter = createEip6963Adapter()
	const stopDiscovery = adapter.start(() => {})
	eventListeners.get('eip6963:announceProvider')?.({
		detail: {
			info: {
				uuid: 'example',
				name: 'Example',
				icon: '',
				rdns: 'com.example.wallet',
			},
			provider,
		},
	})

	return {
		adapter,
		providerListeners,
		stopDiscovery,
	}
}

const startDiscovery = (
	onRequest?: (announce: (detail: Eip6963ProviderDetail) => void) => void
) => {
	let announceProvider: ((event: { detail: Eip6963ProviderDetail }) => void) | undefined
	const candidates = vi.fn()
	vi.stubGlobal('window', {
		addEventListener: (event: string, listener: (event: { detail: Eip6963ProviderDetail }) => void) => {
			if (event === 'eip6963:announceProvider') announceProvider = listener
		},
		removeEventListener: () => {
			announceProvider = undefined
		},
		dispatchEvent: (event: Event) => {
			if (event.type === 'eip6963:requestProvider')
				onRequest?.((detail) => announceProvider?.({ detail }))
			return true
		},
		setTimeout,
		clearTimeout,
	})
	const adapter = createEip6963Adapter()
	const stop = adapter.start(candidates)
	return {
		announce: (detail: Eip6963ProviderDetail) => announceProvider?.({ detail }),
		adapter,
		candidates,
		stop,
	}
}

const providerDetail = (
	uuid: string,
	rdns = 'com.example.wallet'
): Eip6963ProviderDetail => ({
	info: {
		uuid,
		name: `Wallet ${uuid}`,
		icon: '',
		rdns,
	},
	provider: {
		request: vi.fn(async () => []),
	},
})

describe('EIP-6963 discovery identity', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('receives a wallet already listening when the app requests providers', () => {
		const detail = providerDetail('wallet-before-app')
		const { candidates, stop } = startDiscovery((announce) => announce(detail))

		expect(candidates).toHaveBeenCalledWith([
			expect.objectContaining({
				id: 'eip6963:wallet-before-app',
				rdns: 'com.example.wallet',
			}),
		])
		stop()
	})

	it('receives a wallet announcing after the app requested providers', () => {
		const { announce, candidates, stop } = startDiscovery()
		announce(providerDetail('app-before-wallet'))

		expect(candidates).toHaveBeenLastCalledWith([
			expect.objectContaining({ id: 'eip6963:app-before-wallet' }),
		])
		stop()
	})

	it('deduplicates repeated announcements by wallet UUID', () => {
		const { announce, candidates, stop } = startDiscovery()
		announce(providerDetail('repeated'))
		announce(providerDetail('repeated'))

		expect(candidates).toHaveBeenLastCalledWith([
			expect.objectContaining({ id: 'eip6963:repeated' }),
		])
		stop()
	})

	it('keeps distinct UUID wallets that share self-asserted rdns metadata', () => {
		const { announce, candidates, stop } = startDiscovery()
		announce(providerDetail('wallet-a'))
		announce(providerDetail('wallet-b'))

		expect(candidates).toHaveBeenLastCalledWith([
			expect.objectContaining({ id: 'eip6963:wallet-a', rdns: 'com.example.wallet' }),
			expect.objectContaining({ id: 'eip6963:wallet-b', rdns: 'com.example.wallet' }),
		])
		stop()
	})
})

describe('EIP-6963 connection events', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('restores chain scope from the provider when accounts change after reload', async () => {
		const provider = {
			request: vi.fn(async ({ method }) => (
				method === 'eth_chainId' ? '0x1' : []
			)),
		} satisfies Eip1193Provider
		const { adapter, providerListeners, stopDiscovery } = startAdapter(provider)

		const updates = vi.fn()
		const stopConnection = adapter.subscribeConnection(
			'eip6963:example',
			updates
		)
		providerListeners.get('accountsChanged')?.([
			'0x1111111111111111111111111111111111111111',
		])

		await vi.waitFor(() => {
			expect(updates).toHaveBeenLastCalledWith(expect.objectContaining({
				status: BlockheadConnectionStatus.Connected,
				scopes: [expect.objectContaining({ reference: '1' })],
				accounts: [expect.objectContaining({
					reference: '1',
					accountAddress: '0x1111111111111111111111111111111111111111',
				})],
			}))
		})
		expect(provider.request).toHaveBeenCalledWith({
			method: 'eth_chainId',
			params: [],
		})

		providerListeners.get('chainChanged')?.('0x89')
		expect(updates).toHaveBeenLastCalledWith(expect.objectContaining({
			status: BlockheadConnectionStatus.Connected,
			scopes: [expect.objectContaining({ reference: '137' })],
			accounts: [expect.objectContaining({
				reference: '137',
				accountAddress: '0x1111111111111111111111111111111111111111',
			})],
		}))

		stopConnection()
		stopDiscovery()
	})

	it('canonicalizes exact provider chain and account identities without number precision loss', async () => {
		const accounts = [
			'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
			'0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			'0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD',
		] as const
		const provider = {
			request: vi.fn(async ({ method }) => (
				method === 'eth_requestAccounts' ?
					accounts
				:
					'0x20000000000001'
			)),
		} satisfies Eip1193Provider
		const { adapter, stopDiscovery } = startAdapter(provider)

		await expect(adapter.connect('eip6963:example')).resolves.toEqual(
			expect.objectContaining({
				status: BlockheadConnectionStatus.Connected,
				scopes: [expect.objectContaining({ reference: '9007199254740993' })],
				accounts: [
					expect.objectContaining({
						reference: '9007199254740993',
						accountAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
					}),
					expect.objectContaining({
						reference: '9007199254740993',
						accountAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					}),
				],
			})
		)

		stopDiscovery()
	})

	it.each([
		1,
		'1',
		'0X1',
		'0x',
		'0x0',
		'0x01',
		'0x1suffix',
		' 0x1',
		'0x10000000000000000000000000000000000000000',
	])('rejects malformed or noncanonical provider chain identity %j', async (chainId) => {
		const provider = {
			request: vi.fn(async ({ method }) => (
				method === 'eth_requestAccounts' ?
					['0x1111111111111111111111111111111111111111']
				:
					chainId
			)),
		} satisfies Eip1193Provider
		const { adapter, stopDiscovery } = startAdapter(provider)

		await expect(adapter.connect('eip6963:example')).rejects.toThrow(
			'Provider returned an invalid chain ID'
		)

		stopDiscovery()
	})

	it.each([
		{
			accounts: '0x1111111111111111111111111111111111111111',
			expectedError: 'Provider did not return an accounts array',
		},
		{
			accounts: [
				'0x1111111111111111111111111111111111111111',
				'0x1234',
			],
			expectedError: 'Provider returned an invalid EVM account',
		},
		{
			accounts: [
				'0x1111111111111111111111111111111111111111',
				1,
			],
			expectedError: 'Provider returned an invalid EVM account',
		},
		{
			accounts: [
				'0x111111111111111111111111111111111111111g',
			],
			expectedError: 'Provider returned an invalid EVM account',
		},
	])('rejects a malformed provider account payload $accounts without publishing a partial identity', async ({
		accounts,
		expectedError,
	}) => {
		const provider = {
			request: vi.fn(async ({ method }) => (
				method === 'eth_requestAccounts' ?
					accounts
				:
					'0x1'
			)),
		} satisfies Eip1193Provider
		const { adapter, stopDiscovery } = startAdapter(provider)

		await expect(adapter.connect('eip6963:example')).rejects.toThrow(
			expectedError
		)
		expect(provider.request).toHaveBeenCalledOnce()

		stopDiscovery()
	})

	it('normalizes and deduplicates account and chain changes before publication', async () => {
		const provider = {
			request: vi.fn(async ({ method }) => (
				method === 'eth_requestAccounts' ?
					['0x1111111111111111111111111111111111111111']
				:
					'0x1'
			)),
		} satisfies Eip1193Provider
		const { adapter, providerListeners, stopDiscovery } = startAdapter(provider)
		await adapter.connect('eip6963:example')
		const updates = vi.fn()
		const stopConnection = adapter.subscribeConnection(
			'eip6963:example',
			updates
		)

		providerListeners.get('accountsChanged')?.([
			'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
			'0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
		])
		expect(updates).toHaveBeenLastCalledWith(expect.objectContaining({
			scopes: [expect.objectContaining({ reference: '1' })],
			accounts: [expect.objectContaining({
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			})],
		}))

		providerListeners.get('chainChanged')?.('0x20000000000001')
		expect(updates).toHaveBeenLastCalledWith(expect.objectContaining({
			scopes: [expect.objectContaining({ reference: '9007199254740993' })],
			accounts: [expect.objectContaining({
				reference: '9007199254740993',
				accountAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			})],
		}))
		expect(updates).toHaveBeenCalledTimes(2)

		for (const payload of [
			['0x1234'],
			['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 1],
		])
			providerListeners.get('accountsChanged')?.(payload)

		for (const payload of [
			9_007_199_254_740_992,
			'0x0',
			'0x1suffix',
		])
			providerListeners.get('chainChanged')?.(payload)

		expect(updates).toHaveBeenCalledTimes(2)

		stopConnection()
		stopDiscovery()
	})

	it('preserves provider rejection and does not synthesize a connection', async () => {
		const rejection = new Error('User rejected the wallet request')
		const provider = {
			request: vi.fn(async () => {
				throw rejection
			}),
		} satisfies Eip1193Provider
		const { adapter, stopDiscovery } = startAdapter(provider)

		await expect(adapter.connect('eip6963:example')).rejects.toBe(rejection)
		expect(provider.request).toHaveBeenCalledOnce()

		stopDiscovery()
	})

	it('reports provider-initiated disconnect without removing the wallet candidate', async () => {
		const accountAddress = '0x1111111111111111111111111111111111111111'
		const provider = {
			request: vi.fn(async ({ method }) => (
				method === 'eth_requestAccounts' ?
					[accountAddress]
				:
					'0x1'
			)),
		} satisfies Eip1193Provider
		const { adapter, providerListeners, stopDiscovery } = startAdapter(provider)
		const connected = await adapter.connect('eip6963:example')
		const updates = vi.fn()
		const stopConnection = adapter.subscribeConnection(
			'eip6963:example',
			updates
		)

		providerListeners.get('disconnect')?.({
			code: 4900,
			message: 'Provider disconnected',
		})

		expect(updates).toHaveBeenCalledOnce()
		expect(updates).toHaveBeenLastCalledWith(expect.objectContaining({
			walletId: 'eip6963:example',
			status: BlockheadConnectionStatus.Disconnected,
			selected: false,
			connectedAt: connected?.connectedAt,
			disconnectedAt: expect.any(Number),
			scopes: [expect.objectContaining({
				reference: '1',
				events: expect.arrayContaining(['disconnect']),
			})],
			accounts: [],
		}))

		stopConnection()
		expect(providerListeners.has('disconnect')).toBe(false)
		stopDiscovery()
	})

	it('ignores a failed restored chain lookup after chainChanged establishes the scope', async () => {
		const chainLookup = Promise.withResolvers<JsonValue>()
		const provider = {
			request: vi.fn(() => chainLookup.promise),
		} satisfies Eip1193Provider
		const { adapter, providerListeners, stopDiscovery } = startAdapter(provider)
		const updates = vi.fn()
		const stopConnection = adapter.subscribeConnection(
			'eip6963:example',
			updates
		)

		providerListeners.get('accountsChanged')?.([
			'0x1111111111111111111111111111111111111111',
		])
		providerListeners.get('chainChanged')?.('0x89')
		chainLookup.reject(new Error('stale chain lookup failed'))
		await expect(provider.request.mock.results[0]?.value).rejects.toThrow('stale chain lookup failed')

		expect(updates).toHaveBeenCalledTimes(1)
		expect(updates).toHaveBeenLastCalledWith(expect.objectContaining({
			status: BlockheadConnectionStatus.Connected,
			scopes: [expect.objectContaining({ reference: '137' })],
			accounts: [expect.objectContaining({
				reference: '137',
				accountAddress: '0x1111111111111111111111111111111111111111',
			})],
		}))

		stopConnection()
		stopDiscovery()
	})
})
