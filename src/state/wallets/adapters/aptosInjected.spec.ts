import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability, WalletProtocol } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { createAptosInjectedAdapter } from './aptosInjected.ts'
import type { WalletCandidate, WalletConnection } from './types.ts'

const aptosProviders = [
	{
		globalName: 'aptos',
		walletId: 'aptos:petra',
		walletName: 'Petra',
		networkName: 'Mainnet',
		chainId: 1,
		reference: '1',
	},
	{
		globalName: 'martian',
		walletId: 'aptos:martian',
		walletName: 'Martian',
		networkName: 'Provider network',
		chainId: '17',
		reference: '17',
	},
	{
		globalName: 'pontem',
		walletId: 'aptos:pontem',
		walletName: 'Pontem',
		networkName: 'Provider network',
		chainId: 42,
		reference: '42',
	},
] as const

const canonicalAptosAccountA = '0x00000000000000000000000000000000000000000000000000000000000a11ce'
const canonicalAptosAccountB = '0x0000000000000000000000000000000000000000000000000000000000000b0b'
const canonicalAptosAccountC = '0x000000000000000000000000000000000000000000000000000000000000cafe'
const canonicalAptosZeroAccount = '0x0000000000000000000000000000000000000000000000000000000000000000'

const createMockAptosWallet = (
	network: {
		name: string
		chainId: string | number
	},
	account: {
		address: string
		publicKey: string
	} | null
) => {
	let accountChange = (_account: typeof account) => {}
	let networkChange = (_network: typeof network) => {}
	const stopAccountChange = vi.fn()
	const stopNetworkChange = vi.fn()
	const wallet = {
		account,
		connect: vi.fn(async () => {
			if (account == null)
				throw new Error('No Aptos account')

			return account
		}),
		disconnect: vi.fn(async () => {}),
		getNetwork: vi.fn(async () => network),
		onAccountChange: (listener: typeof accountChange) => {
			accountChange = listener

			return stopAccountChange
		},
		onNetworkChange: (listener: typeof networkChange) => {
			networkChange = listener

			return stopNetworkChange
		},
	}

	return {
		accountChange: (nextAccount: typeof account) => accountChange(nextAccount),
		networkChange: (nextNetwork: typeof network) => networkChange(nextNetwork),
		stopAccountChange,
		stopNetworkChange,
		wallet,
	}
}

describe('Aptos injected wallet adapter', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('discovers typed Petra, Martian, and Pontem providers with executable capabilities', () => {
		const wallets = Object.fromEntries(aptosProviders.map(({ globalName }) => [
			globalName,
			createMockAptosWallet(
				{
					name: 'Mainnet',
					chainId: 1,
				},
				{
					address: '0x1',
					publicKey: '0x01',
				}
			).wallet,
		]))
		vi.stubGlobal('window', wallets)

		const updates: WalletCandidate[][] = []
		const cleanup = createAptosInjectedAdapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual(aptosProviders.map(({ walletId, walletName }) => expect.objectContaining({
			id: walletId,
			name: walletName,
			protocol: WalletProtocol.AptosInjected,
			capabilities: [
				WalletCapability.Discover,
				WalletCapability.Connect,
				WalletCapability.Reconnect,
				WalletCapability.Disconnect,
				WalletCapability.ListAccounts,
				WalletCapability.WatchAccounts,
				WalletCapability.WatchScopes,
			],
		})))

		cleanup()
	})

	it.each(aptosProviders)('connects $walletName with the provider-reported Aptos chain ID', async ({
		globalName,
		walletId,
		networkName,
		chainId,
		reference,
	}) => {
		const account = {
			address: '0xA11CE',
			publicKey: '0x01',
		}
		const mock = createMockAptosWallet(
			{
				name: networkName,
				chainId,
			},
			account
		)
		vi.stubGlobal('window', {
			[globalName]: mock.wallet,
		})

		const adapter = createAptosInjectedAdapter()
		adapter.start(() => {})

		const connected = await adapter.connect(walletId)
		expect(connected).toMatchObject({
			walletId,
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.AptosInjected,
			selected: true,
			scopes: [
				{
					namespace: 'aptos',
					reference,
					methods: [
						'connect',
						'disconnect',
						'getNetwork',
					],
					events: [
						'accountChange',
						'networkChange',
					],
				},
			],
			accounts: [
				{
					namespace: 'aptos',
					reference,
					accountAddress: canonicalAptosAccountA,
					capabilities: expect.not.arrayContaining([
						WalletCapability.SignMessage,
						WalletCapability.SignTransaction,
					]),
				},
			],
		})

		const connectionUpdates: WalletConnection[] = []
		const stopConnection = adapter.subscribeConnection(
			walletId,
			(connection) => connectionUpdates.push(connection)
		)
		mock.accountChange({
			address: '0x00000000000000000000000000000000000000000000000000000000000A11CE',
			publicKey: '0x02',
		})
		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)?.accounts).toEqual([
				expect.objectContaining({
					accountAddress: canonicalAptosAccountA,
					reference,
				}),
			])
		})
		expect(new Set([
			...(connected?.accounts.map(({ accountAddress }) => accountAddress) ?? []),
			...(connectionUpdates.at(-1)?.accounts.map(({ accountAddress }) => accountAddress) ?? []),
		])).toEqual(new Set([canonicalAptosAccountA]))

		mock.accountChange({
			address: '0x0000000000000000000000000000000000000000000000000000000000000B0B',
			publicKey: '0x03',
		})
		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)?.accounts).toEqual([
				expect.objectContaining({
					accountAddress: canonicalAptosAccountB,
					reference,
				}),
			])
		})

		mock.networkChange({
			name: 'Provider custom network',
			chainId: 17,
		})
		expect(connectionUpdates.at(-1)).toMatchObject({
			accounts: [
				{
					accountAddress: canonicalAptosAccountB,
					namespace: 'aptos',
					reference: '17',
				},
			],
			scopes: [
				expect.objectContaining({
					namespace: 'aptos',
					reference: '17',
				}),
			],
		})

		mock.accountChange(null)
		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Disconnected,
				accounts: [],
				selected: false,
			})
		})

		stopConnection()
		adapter.disconnect(walletId)
		expect(mock.wallet.disconnect).toHaveBeenCalledOnce()
	})

	it('restores an already-authorized provider account without calling connect', async () => {
		const mock = createMockAptosWallet(
			{
				name: 'Mainnet',
				chainId: 1,
			},
			{
				address: '0xCAFE',
				publicKey: '0x03',
			}
		)
		vi.stubGlobal('window', {
			aptos: mock.wallet,
		})

		const adapter = createAptosInjectedAdapter()
		const stopDiscovery = adapter.start(() => {})
		const connectionUpdates: WalletConnection[] = []
		const stopConnection = adapter.subscribeConnection(
			'aptos:petra',
			(connection) => connectionUpdates.push(connection)
		)

		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Connected,
				accounts: [
					expect.objectContaining({
						accountAddress: canonicalAptosAccountC,
						reference: '1',
					}),
				],
			})
		})
		expect(mock.wallet.connect).not.toHaveBeenCalled()

		stopConnection()
		expect(mock.stopAccountChange).toHaveBeenCalledOnce()
		expect(mock.stopNetworkChange).toHaveBeenCalledOnce()
		mock.networkChange({
			name: 'Provider custom network',
			chainId: 17,
		})
		expect(connectionUpdates).toHaveLength(1)

		stopDiscovery()
		expect(mock.stopAccountChange).toHaveBeenCalledOnce()
		expect(mock.stopNetworkChange).toHaveBeenCalledOnce()
	})

	it('reports an empty cold restore as disconnected without prompting', async () => {
		const mock = createMockAptosWallet(
			{
				name: 'Mainnet',
				chainId: 1,
			},
			null
		)
		vi.stubGlobal('window', {
			aptos: mock.wallet,
		})
		const adapter = createAptosInjectedAdapter()
		adapter.start(() => {})
		const connectionUpdates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'aptos:petra',
			(connection) => connectionUpdates.push(connection)
		)

		await vi.waitFor(() => {
			expect(connectionUpdates).toEqual([
				expect.objectContaining({
					status: BlockheadConnectionStatus.Disconnected,
					accounts: [],
					selected: false,
				}),
			])
		})
		expect(mock.wallet.connect).not.toHaveBeenCalled()

		unsubscribe()
	})

	it.each([
		'',
		'1',
		'0X1',
		'0x',
		'0xgg',
		`0x${'1'.repeat(65)}`,
		' 0x1',
		'0x1 ',
	])('rejects malformed provider account address %s during connect', async (address) => {
		const mock = createMockAptosWallet(
			{
				name: 'Mainnet',
				chainId: 1,
			},
			{
				address,
				publicKey: '0x01',
			}
		)
		vi.stubGlobal('window', {
			aptos: mock.wallet,
		})
		const adapter = createAptosInjectedAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('aptos:petra')).rejects.toThrow(
			'Aptos wallet did not expose a valid account address'
		)
	})

	it('rejects malformed restored and changed accounts before publishing an account identity', async () => {
		const mock = createMockAptosWallet(
			{
				name: 'Mainnet',
				chainId: 1,
			},
			{
				address: '0xnot-hex',
				publicKey: '0x01',
			}
		)
		vi.stubGlobal('window', {
			aptos: mock.wallet,
		})
		const adapter = createAptosInjectedAdapter()
		adapter.start(() => {})
		const connectionUpdates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'aptos:petra',
			(connection) => connectionUpdates.push(connection)
		)

		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Error,
				accounts: [],
				selected: false,
				error: expect.stringContaining('Aptos wallet did not expose a valid account address'),
			})
		})

		mock.accountChange({
			address: '0x0',
			publicKey: '0x02',
		})
		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Connected,
				accounts: [
					expect.objectContaining({
						accountAddress: canonicalAptosZeroAccount,
					}),
				],
			})
		})

		mock.accountChange({
			address: `0x${'1'.repeat(65)}`,
			publicKey: '0x03',
		})
		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Error,
				accounts: [],
				selected: false,
				error: expect.stringContaining('Aptos wallet did not expose a valid account address'),
			})
		})

		unsubscribe()
	})

	it('preserves approval and disconnect rejection', async () => {
		const approvalRejection = new Error('User rejected Aptos access')
		const disconnectRejection = new Error('Wallet rejected disconnect')
		const mock = createMockAptosWallet(
			{
				name: 'Mainnet',
				chainId: 1,
			},
			{
				address: '0xa11ce',
				publicKey: '0x01',
			}
		)
		mock.wallet.connect.mockRejectedValueOnce(approvalRejection)
		mock.wallet.disconnect.mockRejectedValueOnce(disconnectRejection)
		vi.stubGlobal('window', {
			aptos: mock.wallet,
		})
		const adapter = createAptosInjectedAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('aptos:petra')).rejects.toBe(approvalRejection)
		await expect(adapter.disconnect('aptos:petra')).rejects.toBe(disconnectRejection)
	})

	it('cancels a pending cold restore and detaches both provider listeners', async () => {
		const network = Promise.withResolvers<{
			name: string
			chainId: number
		}>()
		const mock = createMockAptosWallet(
			{
				name: 'Mainnet',
				chainId: 1,
			},
			{
				address: '0xa11ce',
				publicKey: '0x01',
			}
		)
		mock.wallet.getNetwork.mockImplementationOnce(() => network.promise)
		vi.stubGlobal('window', {
			aptos: mock.wallet,
		})
		const adapter = createAptosInjectedAdapter()
		adapter.start(() => {})
		const connectionUpdates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'aptos:petra',
			(connection) => connectionUpdates.push(connection)
		)

		unsubscribe()
		network.resolve({
			name: 'Mainnet',
			chainId: 1,
		})
		await network.promise
		await Promise.resolve()

		expect(connectionUpdates).toEqual([])
		expect(mock.stopAccountChange).toHaveBeenCalledOnce()
		expect(mock.stopNetworkChange).toHaveBeenCalledOnce()
	})

	it('does not let a stale account read overwrite a newer network event', async () => {
		const staleNetwork = Promise.withResolvers<{
			name: string
			chainId: number
		}>()
		const mock = createMockAptosWallet(
			{
				name: 'Mainnet',
				chainId: 1,
			},
			{
				address: '0xa11ce',
				publicKey: '0x01',
			}
		)
		vi.stubGlobal('window', {
			aptos: mock.wallet,
		})
		const adapter = createAptosInjectedAdapter()
		adapter.start(() => {})
		await adapter.connect('aptos:petra')
		const connectionUpdates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'aptos:petra',
			(connection) => connectionUpdates.push(connection)
		)
		mock.wallet.getNetwork.mockImplementationOnce(() => staleNetwork.promise)
		mock.accountChange({
			address: '0xb0b',
			publicKey: '0x02',
		})
		mock.networkChange({
			name: 'Provider custom network',
			chainId: 17,
		})
		staleNetwork.resolve({
			name: 'Mainnet',
			chainId: 1,
		})
		await staleNetwork.promise
		await Promise.resolve()

		expect(connectionUpdates).toEqual([
			expect.objectContaining({
				scopes: [expect.objectContaining({ reference: '17' })],
			}),
		])

		unsubscribe()
	})

	it.each([
		'',
		'01',
		'testnet',
		0,
		-1,
		1.5,
		256,
		'256',
		'999999999999999999999999999999',
	])('rejects non-canonical provider chain ID %s', async (chainId) => {
		const mock = createMockAptosWallet(
			{
				name: 'Ambiguous network',
				chainId,
			},
			{
				address: '0xa11ce',
				publicKey: '0x01',
			}
		)
		vi.stubGlobal('window', {
			aptos: mock.wallet,
		})

		const adapter = createAptosInjectedAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('aptos:petra')).rejects.toThrow(
			'Aptos wallet did not expose a canonical chain ID'
		)
	})
})
