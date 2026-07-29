import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { createCosmosOfflineSignerAdapter } from './cosmosOfflineSigner.ts'
import type { WalletConnection } from './types.ts'

const cosmosAccountA = 'cosmos1ruszzg3rysjjvfeg9y4zktpd9chnqvfje038ze'
const cosmosAccountB = 'cosmos18cl5qs2zgdzy23j8fpy55j6vf48y75z395ggwe'
const cosmosAccountC = 'cosmos1t4097crpvf3kgetxva5xj6ntd3kkummsuf47gz'
const cosmosAccountD = 'cosmos1037huluqsxpg8py9s6rc3zv23wxgmr50qhc2ly'

const setup = (connected = true) => {
	const listeners = new Map<string, () => void>()
	let accounts = [cosmosAccountA.toUpperCase()]
	const leap = {
		enable: vi.fn(async () => {}),
		getOfflineSignerAuto: vi.fn(async () => ({
			getAccounts: async () => accounts.map((address) => ({
				address,
				pubkey: new Uint8Array(),
				algo: 'secp256k1',
			})),
		})),
		isConnected: vi.fn(async () => connected),
		disconnect: vi.fn(async () => true),
	}
	vi.stubGlobal('window', {
		leap,
		addEventListener: (event: string, listener: () => void) => listeners.set(event, listener),
		removeEventListener: (event: string) => listeners.delete(event),
	})

	return {
		leap,
		listeners,
		setAccounts: (nextAccounts: string[]) => {
			accounts = nextAccounts
		},
	}
}

describe('Cosmos offline signer adapter', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses Leap connection state for silent restoration without enabling again', async () => {
		const { leap } = setup()
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []

		adapter.subscribeConnection('cosmos:leap', (connection) => updates.push(connection))

		await vi.waitFor(() => expect(updates.at(-1)?.accounts[0]?.accountAddress).toBe(cosmosAccountA))
		expect(leap.isConnected).toHaveBeenCalledWith('cosmoshub-4')
		expect(leap.enable).not.toHaveBeenCalled()
	})

	it('discovers Keplr, Leap, and namespaced Trust with only implemented disconnect capabilities', () => {
		const { leap } = setup()
		vi.stubGlobal('window', {
			keplr: leap,
			leap,
			trustwallet: {
				cosmos: leap,
			},
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})
		const candidates: {
			id: string
			capabilities: WalletCapability[]
		}[][] = []
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start((nextCandidates) => candidates.push(nextCandidates))

		expect(candidates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'cosmos:keplr',
				capabilities: expect.not.arrayContaining([WalletCapability.Disconnect]),
			}),
			expect.objectContaining({
				id: 'cosmos:leap',
				capabilities: expect.arrayContaining([WalletCapability.Disconnect]),
			}),
			expect.objectContaining({
				id: 'cosmos:trustwallet',
				capabilities: expect.not.arrayContaining([WalletCapability.Disconnect]),
			}),
		])
	})

	it('restores and refreshes namespaced Trust through the Keplr-compatible event', async () => {
		const { leap: trustWallet, listeners, setAccounts } = setup()
		vi.stubGlobal('window', {
			trustwallet: {
				cosmos: trustWallet,
			},
			addEventListener: (event: string, listener: () => void) => listeners.set(event, listener),
			removeEventListener: (event: string) => listeners.delete(event),
		})
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'cosmos:trustwallet',
			(connection) => updates.push(connection)
		)

		await vi.waitFor(() => expect(updates.at(-1)?.accounts[0]?.accountAddress).toBe(cosmosAccountA))
		expect(trustWallet.enable).not.toHaveBeenCalled()
		expect(trustWallet.isConnected).not.toHaveBeenCalled()

		setAccounts([cosmosAccountB])
		listeners.get('keplr_keystorechange')?.()
		await vi.waitFor(() => expect(updates.at(-1)?.accounts[0]?.accountAddress).toBe(cosmosAccountB))

		unsubscribe()
		expect(listeners.has('keplr_keystorechange')).toBe(false)
	})

	it('reports a disconnected Leap restoration and performs its documented disconnect', async () => {
		const { leap } = setup(false)
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []

		adapter.subscribeConnection('cosmos:leap', (connection) => updates.push(connection))
		await vi.waitFor(() => expect(updates.at(-1)?.status).toBe(BlockheadConnectionStatus.Disconnected))
		expect(leap.getOfflineSignerAuto).not.toHaveBeenCalled()

		await adapter.disconnect('cosmos:leap')
		expect(leap.disconnect).toHaveBeenCalledWith('cosmoshub-4')
	})

	it('refreshes an enabled connection on the vendor event without another permission request', async () => {
		const { leap, listeners, setAccounts } = setup()
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})
		await expect(adapter.connect('cosmos:leap')).resolves.toMatchObject({
			accounts: [
				expect.objectContaining({
					accountAddress: cosmosAccountA,
				}),
			],
		})
		const updates: WalletConnection[] = []
		adapter.subscribeConnection('cosmos:leap', (connection) => updates.push(connection))

		setAccounts([cosmosAccountB])
		listeners.get('leap_keystorechange')?.()
		await vi.waitFor(() => expect(updates.at(-1)?.accounts[0]?.accountAddress).toBe(cosmosAccountB))
		expect(leap.enable).toHaveBeenCalledOnce()
	})

	it.each([
		'',
		'cosmos1first',
		`${cosmosAccountA.slice(0, -1)}q`,
		`COSMOS${cosmosAccountA.slice(6)}`,
		'osmo1ruszzg3rysjjvfeg9y4zktpd9chnqvfj35zh5t',
	])('rejects malformed, mixed-case, wrong-prefix, or checksum-invalid address %s', async (accountAddress) => {
		const { setAccounts } = setup()
		setAccounts([accountAddress])
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('cosmos:leap')).rejects.toThrow(
			'Cosmos wallet returned an invalid cosmoshub-4 account address'
		)
	})

	it('rejects malformed restored and changed accounts before publishing account identity', async () => {
		const { listeners, setAccounts } = setup()
		setAccounts(['osmo1ruszzg3rysjjvfeg9y4zktpd9chnqvfj35zh5t'])
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'cosmos:leap',
			(connection) => updates.push(connection)
		)

		await vi.waitFor(() => {
			expect(updates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Error,
				accounts: [],
				selected: false,
				error: expect.stringContaining('Cosmos wallet returned an invalid cosmoshub-4 account address'),
			})
		})
		expect(updates).toHaveLength(1)

		setAccounts([cosmosAccountA.toUpperCase()])
		listeners.get('leap_keystorechange')?.()
		await vi.waitFor(() => {
			expect(updates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Connected,
				accounts: [
					expect.objectContaining({
						accountAddress: cosmosAccountA,
					}),
				],
			})
		})
		expect(updates).toHaveLength(2)

		setAccounts([`${cosmosAccountA.slice(0, -1)}q`])
		listeners.get('leap_keystorechange')?.()
		await vi.waitFor(() => {
			expect(updates.at(-1)).toMatchObject({
				status: BlockheadConnectionStatus.Error,
				accounts: [],
				selected: false,
				error: expect.stringContaining('Cosmos wallet returned an invalid cosmoshub-4 account address'),
			})
		})
		expect(updates).toHaveLength(3)

		unsubscribe()
	})

	it('normalizes every account and reports an empty keystore update as disconnected', async () => {
		const { listeners, setAccounts } = setup()
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})
		await adapter.connect('cosmos:leap')
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'cosmos:leap',
			(connection) => updates.push(connection)
		)

		setAccounts([
			cosmosAccountA,
			cosmosAccountA.toUpperCase(),
			cosmosAccountB,
		])
		listeners.get('leap_keystorechange')?.()
		await vi.waitFor(() => expect(updates.at(-1)?.accounts).toEqual([
			expect.objectContaining({ accountAddress: cosmosAccountA }),
			expect.objectContaining({ accountAddress: cosmosAccountB }),
		]))
		setAccounts([])
		listeners.get('leap_keystorechange')?.()
		await vi.waitFor(() => expect(updates.at(-1)).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
			selected: false,
			disconnectedAt: expect.any(Number),
		})))

		unsubscribe()
		expect(listeners.has('leap_keystorechange')).toBe(false)
	})

	it('preserves enable approval and Leap disconnect rejection', async () => {
		const approvalRejection = new Error('User rejected Cosmos access')
		const disconnectRejection = new Error('Leap rejected disconnect')
		const { leap } = setup()
		leap.enable.mockRejectedValueOnce(approvalRejection)
		leap.disconnect.mockRejectedValueOnce(disconnectRejection)
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})

		await expect(adapter.connect('cosmos:leap')).rejects.toBe(approvalRejection)
		await expect(adapter.disconnect('cosmos:leap')).rejects.toBe(disconnectRejection)
	})

	it('cancels stale account reads and pending restore after cleanup', async () => {
		const { leap, listeners } = setup()
		const staleAccounts = Promise.withResolvers<{
			address: string
			pubkey: Uint8Array
			algo: string
		}[]>()
		const currentAccounts = Promise.withResolvers<{
			address: string
			pubkey: Uint8Array
			algo: string
		}[]>()
		leap.getOfflineSignerAuto
			.mockResolvedValueOnce({
				getAccounts: () => staleAccounts.promise,
			})
			.mockResolvedValueOnce({
				getAccounts: () => currentAccounts.promise,
			})
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'cosmos:leap',
			(connection) => updates.push(connection)
		)
		await vi.waitFor(() => expect(leap.getOfflineSignerAuto).toHaveBeenCalledOnce())
		listeners.get('leap_keystorechange')?.()
		currentAccounts.resolve([{
			address: cosmosAccountC,
			pubkey: new Uint8Array(),
			algo: 'secp256k1',
		}])
		await currentAccounts.promise
		await vi.waitFor(() => expect(updates.at(-1)?.accounts[0]?.accountAddress).toBe(cosmosAccountC))
		staleAccounts.resolve([{
			address: cosmosAccountD,
			pubkey: new Uint8Array(),
			algo: 'secp256k1',
		}])
		await staleAccounts.promise
		await Promise.resolve()
		expect(updates).toHaveLength(1)

		unsubscribe()
		expect(listeners.has('leap_keystorechange')).toBe(false)
	})

	it('does not claim a silent status check or disconnect for Keplr', async () => {
		const { leap, listeners } = setup()
		vi.stubGlobal('window', {
			keplr: leap,
			addEventListener: (event: string, listener: () => void) => listeners.set(event, listener),
			removeEventListener: (event: string) => listeners.delete(event),
		})
		const adapter = createCosmosOfflineSignerAdapter()
		adapter.start(() => {})
		const update = vi.fn()

		adapter.subscribeConnection('cosmos:keplr', update)
		await adapter.disconnect('cosmos:keplr')

		await vi.waitFor(() => expect(update).toHaveBeenCalled())
		expect(leap.isConnected).not.toHaveBeenCalled()
		expect(leap.disconnect).not.toHaveBeenCalled()
	})
})
