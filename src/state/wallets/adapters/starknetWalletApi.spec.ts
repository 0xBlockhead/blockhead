import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { createStarknetWalletApiAdapter } from './starknetWalletApi.ts'
import type { WalletCandidate, WalletConnection } from './types.ts'

const firstAddress = '0x1234'
const normalizedFirstAddress = '0x0000000000000000000000000000000000000000000000000000000000001234'
const secondAddress = '0xAbCd'
const normalizedSecondAddress = '0x000000000000000000000000000000000000000000000000000000000000abcd'
const maximumFieldElement = '0x0800000000000011000000000000000000000000000000000000000000000000'
const starknetPrime = '0x800000000000011000000000000000000000000000000000000000000000001'
const mainnetChainId = '0x534e5f4d41494e'
const sepoliaChainId = '0x534e5f5345504f4c4941'

const setup = () => {
	let accountListener = (_accounts?: string[]) => {}
	let networkListener = (_chainId?: string, _accounts?: string[]) => {}
	let accounts = [firstAddress]
	let chainId = mainnetChainId
	const wallet = {
		id: 'argentX',
		name: 'Argent X wallet',
		icon: 'data:image/svg+xml,<svg/>',
		request: vi.fn(async (call: { type: string }) => (
			call.type === 'wallet_requestAccounts' ? accounts : chainId
		)),
		on: (
			event: string,
			listener: ((accounts?: string[]) => void) | ((chainId?: string, accounts?: string[]) => void)
		) => {
			if (event === 'accountsChanged')
				accountListener = listener
			else
				networkListener = listener
		},
		off: (event: string) => {
			if (event === 'accountsChanged')
				accountListener = () => {}
			else
				networkListener = () => {}
		},
	}
	vi.stubGlobal('window', {
		starknet_argentX: wallet,
	})

	return {
		accountsChanged: (nextAccounts?: string[]) => {
			accounts = nextAccounts ?? []
			accountListener(nextAccounts)
		},
		networkChanged: (nextChainId?: string, nextAccounts?: string[]) => {
			chainId = nextChainId ?? chainId
			accounts = nextAccounts ?? []
			networkListener(nextChainId, nextAccounts)
		},
		remainingListeners: () => Number(accountListener.length > 0) + Number(networkListener.length > 0),
		wallet,
	}
}

describe('Starknet Wallet API adapter', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('discovers provider metadata and only truthful lifecycle capabilities', () => {
		const { wallet } = setup()
		vi.stubGlobal('window', {
			starknet: {
				...wallet,
				name: 'Generic Starknet wallet',
			},
			starknet_argentX: wallet,
			starknet_braavos: {
				...wallet,
				name: 'Braavos wallet',
			},
		})
		const candidates: WalletCandidate[][] = []
		const stop = createStarknetWalletApiAdapter().start((nextCandidates) => candidates.push(nextCandidates))

		expect(candidates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'starknet:injected',
				name: 'Generic Starknet wallet',
			}),
			expect.objectContaining({
				id: 'starknet:argentx',
				name: wallet.name,
				icon: wallet.icon,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.WatchScopes,
				],
			}),
			expect.objectContaining({
				id: 'starknet:braavos',
				name: 'Braavos wallet',
			}),
		])
		expect(candidates[0]).toEqual(expect.arrayContaining([
			expect.objectContaining({
				capabilities: expect.not.arrayContaining([WalletCapability.Disconnect]),
			}),
		]))

		stop()
	})

	it('connects canonical deduplicated felt accounts and decodes the Starknet CAIP reference', async () => {
		const { accountsChanged, wallet } = setup()
		accountsChanged([
			firstAddress,
			normalizedFirstAddress,
			secondAddress,
			maximumFieldElement,
		])
		const adapter = createStarknetWalletApiAdapter()
		adapter.start(() => {})

		expect(await adapter.connect('starknet:argentx')).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Connected,
			scopes: [expect.objectContaining({
				namespace: 'starknet',
				reference: 'SN_MAIN',
			})],
			accounts: [
				expect.objectContaining({
					namespace: 'starknet',
					reference: 'SN_MAIN',
					accountAddress: normalizedFirstAddress,
				}),
				expect.objectContaining({
					namespace: 'starknet',
					reference: 'SN_MAIN',
					accountAddress: normalizedSecondAddress,
				}),
				expect.objectContaining({
					namespace: 'starknet',
					reference: 'SN_MAIN',
					accountAddress: maximumFieldElement,
				}),
			],
			activeAccount: expect.objectContaining({
				accountAddress: normalizedFirstAddress,
			}),
			selected: true,
		}))
		expect(wallet.request).toHaveBeenNthCalledWith(1, {
			type: 'wallet_requestAccounts',
			params: {
				silent_mode: false,
			},
		})
		expect(wallet.request).toHaveBeenNthCalledWith(2, {
			type: 'wallet_requestChainId',
		})
	})

	it('reconnects silently, tracks both specified events, and removes listeners', async () => {
		const { accountsChanged, networkChanged, remainingListeners, wallet } = setup()
		const adapter = createStarknetWalletApiAdapter()
		const stop = adapter.start(() => {})
		const connections: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'starknet:argentx',
			(connection) => connections.push(connection)
		)

		await vi.waitFor(() => {
			expect(connections.at(-1)?.accounts[0]?.accountAddress).toBe(normalizedFirstAddress)
		})
		expect(wallet.request).toHaveBeenNthCalledWith(1, {
			type: 'wallet_requestAccounts',
			params: {
				silent_mode: true,
			},
		})

		accountsChanged([secondAddress])
		expect(connections.at(-1)?.accounts[0]).toEqual(expect.objectContaining({
			accountAddress: normalizedSecondAddress,
			reference: 'SN_MAIN',
		}))
		networkChanged(sepoliaChainId, [secondAddress])
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			scopes: [expect.objectContaining({ reference: 'SN_SEPOLIA' })],
			accounts: [expect.objectContaining({ reference: 'SN_SEPOLIA' })],
		}))
		networkChanged(mainnetChainId)
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			scopes: [expect.objectContaining({ reference: 'SN_MAIN' })],
			accounts: [expect.objectContaining({
				accountAddress: normalizedSecondAddress,
				reference: 'SN_MAIN',
			})],
		}))
		accountsChanged()
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
			selected: false,
		}))

		adapter.disconnect('starknet:argentx')
		expect(wallet.request).not.toHaveBeenCalledWith(expect.objectContaining({
			type: 'wallet_disconnect',
		}))
		unsubscribe()
		expect(remainingListeners()).toBe(0)
		stop()
	})

	it('preserves approval rejection and rejects malformed provider output', async () => {
		const { wallet } = setup()
		const adapter = createStarknetWalletApiAdapter()
		adapter.start(() => {})
		wallet.request.mockRejectedValueOnce(Object.assign(new Error('User rejected'), { code: 4001 }))

		await expect(adapter.connect('starknet:argentx')).rejects.toMatchObject({
			code: 4001,
		})
		wallet.request.mockResolvedValueOnce(['not-an-address'])
		await expect(adapter.connect('starknet:argentx')).rejects.toThrow('invalid account')
		wallet.request.mockResolvedValueOnce([firstAddress])
		wallet.request.mockResolvedValueOnce('SN_MAIN')
		await expect(adapter.connect('starknet:argentx')).rejects.toThrow('canonical chain ID')
	})

	it('rejects out-of-field and malformed account values before connection publication', async () => {
		for (const {
			account,
			violation,
		} of [
			{
				violation: 'prime',
				account: starknetPrime,
			},
			{
				violation: 'above prime',
				account: '0x800000000000011000000000000000000000000000000000000000000000002',
			},
			{
				violation: '64-digit maximum',
				account: `0x${'f'.repeat(64)}`,
			},
			{
				violation: '65-digit padded form',
				account: `0x${'0'.repeat(64)}1`,
			},
			{
				violation: 'empty hex payload',
				account: '0x',
			},
			{
				violation: 'uppercase prefix',
				account: '0X1234',
			},
			{
				violation: 'missing prefix',
				account: '1234',
			},
			{
				violation: 'negative value',
				account: '-0x1',
			},
			{
				violation: 'whitespace',
				account: ' 0x1234',
			},
			{
				violation: 'non-hex digit',
				account: '0x123g',
			},
		]) {
			const { wallet } = setup()
			wallet.request
				.mockResolvedValueOnce([account])
				.mockResolvedValueOnce(mainnetChainId)
			const adapter = createStarknetWalletApiAdapter()
			adapter.start(() => {})

			await expect(
				adapter.connect('starknet:argentx'),
				violation
			).rejects.toThrow('Starknet wallet returned an invalid account address')
			vi.unstubAllGlobals()
		}
	})

	it('does not publish invalid restored or changed accounts and recovers on valid events', async () => {
		const {
			accountsChanged,
			networkChanged,
			wallet,
		} = setup()
		accountsChanged([starknetPrime])
		const adapter = createStarknetWalletApiAdapter()
		adapter.start(() => {})
		const connections: WalletConnection[] = []
		adapter.subscribeConnection(
			'starknet:argentx',
			(connection) => connections.push(connection)
		)
		await vi.waitFor(() => expect(wallet.request).toHaveBeenCalledTimes(2))
		await Promise.resolve()
		expect(connections).toEqual([])

		accountsChanged(['0x800000000000011000000000000000000000000000000000000000000000002'])
		expect(connections).toEqual([])

		accountsChanged([secondAddress])
		await vi.waitFor(() => expect(connections.at(-1)?.accounts[0]).toEqual(expect.objectContaining({
			accountAddress: normalizedSecondAddress,
			reference: 'SN_MAIN',
		})))
		networkChanged(sepoliaChainId, [starknetPrime])
		expect(connections.at(-1)?.scopes[0]?.reference).toBe('SN_MAIN')

		networkChanged(sepoliaChainId, [firstAddress])
		expect(connections.at(-1)).toEqual(expect.objectContaining({
			scopes: [expect.objectContaining({ reference: 'SN_SEPOLIA' })],
			accounts: [expect.objectContaining({
				accountAddress: normalizedFirstAddress,
				reference: 'SN_SEPOLIA',
			})],
		}))
	})

	it('cancels a stale silent restore after an earlier account event and cleans up listeners', async () => {
		const restoreAccounts = Promise.withResolvers<string[]>()
		const { accountsChanged, remainingListeners, wallet } = setup()
		wallet.request.mockImplementation((call: { type: string }) => (
			call.type === 'wallet_requestAccounts' ?
				restoreAccounts.promise
			:
				Promise.resolve(mainnetChainId)
		))
		const adapter = createStarknetWalletApiAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'starknet:argentx',
			(connection) => updates.push(connection)
		)
		accountsChanged([secondAddress])
		await vi.waitFor(() => expect(updates.at(-1)?.accounts[0]?.accountAddress).toBe(normalizedSecondAddress))
		restoreAccounts.resolve([firstAddress])
		await restoreAccounts.promise
		await Promise.resolve()

		expect(updates).toHaveLength(1)
		unsubscribe()
		expect(remainingListeners()).toBe(0)
	})
})
