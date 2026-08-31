import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { createCardanoCip30Adapter } from './cardanoCip30.ts'
import type { WalletConnection } from './types.ts'

const mainnetAddress = '019493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251'
const secondMainnetAddress = '018493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251'
const mainnetPointerAddress = `41${'11'.repeat(28)}000000`

describe('Cardano CIP-30 wallet adapter', () => {
	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	it('silently restores and normalizes every authorized CIP-30 account', async () => {
		const enable = vi.fn(async () => ({
			getNetworkId: async () => 1,
			getUsedAddresses: async () => [
				mainnetAddress,
				secondMainnetAddress,
				mainnetPointerAddress,
			],
			getUnusedAddresses: async () => [
				mainnetAddress,
			],
		}))
		vi.stubGlobal('window', {
			cardano: {
				nami: {
					enable,
					isEnabled: vi.fn(async () => true),
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		const updates: WalletConnection[] = []
		adapter.start(() => {})

		adapter.subscribeConnection('cip30:nami', (connection) => updates.push(connection))

		await vi.waitFor(() => expect(updates).toHaveLength(1))
		expect(enable).toHaveBeenCalledWith({
			extensions: [
				{
					cip: 142,
				},
			],
		})
		expect(updates[0]).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			accounts: [
				{
					namespace: 'cip34',
					reference: '1-764824073',
				},
				{
					namespace: 'cip34',
					reference: '1-764824073',
				},
				{
					namespace: 'cip34',
					reference: '1-764824073',
				},
			],
		})
	})

	it('reports a persisted session as disconnected when CIP-30 authorization is absent', async () => {
		const enable = vi.fn()
		vi.stubGlobal('window', {
			cardano: {
				nami: {
					enable,
					isEnabled: vi.fn(async () => false),
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		const updates: WalletConnection[] = []
		adapter.start(() => {})

		adapter.subscribeConnection('cip30:nami', (connection) => updates.push(connection))

		await vi.waitFor(() => expect(updates).toHaveLength(1))
		expect(enable).not.toHaveBeenCalled()
		expect(updates[0]).toMatchObject({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
		})
	})

	it('preserves approval rejection and does not synthesize a connection', async () => {
		const rejection = {
			code: -3,
			info: 'User declined access',
		}
		const enable = vi.fn(async () => {
			throw rejection
		})
		vi.stubGlobal('window', {
			cardano: {
				lace: {
					enable,
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		adapter.start(() => {})

		await expect(adapter.connect('cip30:lace')).rejects.toBe(rejection)
		expect(enable).toHaveBeenCalledOnce()
	})

	it('rejects malformed payment structure and contradictory mainnet identity before publication', async () => {
		const enable = vi.fn()
			.mockResolvedValueOnce({
				getNetworkId: async () => 1,
				getUsedAddresses: async () => [
					mainnetAddress.slice(0, -2),
				],
			})
			.mockResolvedValueOnce({
				cip142: {
					getNetworkMagic: async () => 2,
				},
				getNetworkId: async () => 1,
				getUsedAddresses: async () => [
					mainnetAddress,
				],
			})
			.mockResolvedValueOnce({
				getNetworkId: async () => 1,
				getUsedAddresses: async () => [
					'82d8185821a100581caabbcc',
				],
			})
		vi.stubGlobal('window', {
			cardano: {
				lace: {
					enable,
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		adapter.start(() => {})

		await expect(adapter.connect('cip30:lace')).rejects.toThrow(
			'Cardano CIP-30 wallet returned a malformed payment address'
		)
		await expect(adapter.connect('cip30:lace')).rejects.toThrow(
			'Cardano CIP-30 wallet did not expose a canonical CIP-34 network'
		)
		await expect(adapter.connect('cip30:lace')).rejects.toThrow(
			'Cardano CIP-30 wallet returned a non-payment address'
		)
	})

	it('reauthorizes after AccountChange and publishes the new account and network', async () => {
		vi.useFakeTimers()
		let enabled = true
		const changedApi = {
			cip142: {
				getNetworkMagic: vi.fn(async () => 2),
			},
			getNetworkId: vi.fn(async () => 0),
			getUsedAddresses: vi.fn(async () => [
				`00${mainnetAddress.slice(2)}`,
			]),
		}
		const initialGetNetworkId = vi.fn()
			.mockResolvedValueOnce(1)
			.mockRejectedValueOnce({
				code: -4,
				info: 'Account changed',
			})
		const enable = vi.fn()
			.mockResolvedValueOnce({
				getNetworkId: initialGetNetworkId,
				getUsedAddresses: async () => [mainnetAddress],
			})
			.mockResolvedValueOnce(changedApi)
		vi.stubGlobal('window', {
			cardano: {
				lace: {
					enable,
					isEnabled: vi.fn(async () => enabled),
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		const updates: WalletConnection[] = []
		adapter.start(() => {})
		const unsubscribe = adapter.subscribeConnection(
			'cip30:lace',
			(connection) => updates.push(connection)
		)
		await vi.waitFor(() => expect(updates).toHaveLength(1))

		await vi.advanceTimersByTimeAsync(1_000)
		await vi.waitFor(() => expect(updates).toHaveLength(2))
		expect(enable).toHaveBeenCalledTimes(2)
		expect(updates[1]).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			scopes: [
				expect.objectContaining({
					reference: '0-2',
					events: [],
				}),
			],
			accounts: [
				expect.objectContaining({
					reference: '0-2',
					accountAddress: expect.stringMatching(/^addr_test1/),
				}),
			],
		})

		enabled = false
		await vi.advanceTimersByTimeAsync(1_000)
		await vi.waitFor(() => expect(updates).toHaveLength(3))
		expect(updates[2]).toMatchObject({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
		})

		unsubscribe()
		await vi.advanceTimersByTimeAsync(2_000)
		expect(updates).toHaveLength(3)
	})

	it('cancels a pending reload check and its poll on cleanup', async () => {
		vi.useFakeTimers()
		const enabled = Promise.withResolvers<boolean>()
		vi.stubGlobal('window', {
			cardano: {
				nami: {
					enable: vi.fn(),
					isEnabled: vi.fn(() => enabled.promise),
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		const updates: WalletConnection[] = []
		adapter.start(() => {})
		const unsubscribe = adapter.subscribeConnection(
			'cip30:nami',
			(connection) => updates.push(connection)
		)

		unsubscribe()
		enabled.resolve(false)
		await enabled.promise
		await Promise.resolve()
		await vi.advanceTimersByTimeAsync(2_000)

		expect(updates).toEqual([])
	})

	it('keeps disconnect local because CIP-30 defines no disconnect method', async () => {
		const enable = vi.fn(async () => ({
			getNetworkId: async () => 1,
			getUsedAddresses: async () => [mainnetAddress],
		}))
		vi.stubGlobal('window', {
			cardano: {
				nami: {
					enable,
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		adapter.start(() => {})

		await adapter.connect('cip30:nami')
		await adapter.disconnect('cip30:nami')
		expect(enable).toHaveBeenCalledOnce()
	})

	it('advertises SignMessage and signs via signData when connected', async () => {
		const signData = vi.fn(async () => ({
			signature: 'cip30-signature',
			key: 'cip30-key',
		}))
		const enable = vi.fn(async () => ({
			getNetworkId: async () => 1,
			getUsedAddresses: async () => [mainnetAddress],
			signData,
		}))
		vi.stubGlobal('window', {
			cardano: {
				nami: {
					enable,
				},
			},
		})
		const adapter = createCardanoCip30Adapter()
		adapter.start(() => {})

		const connection = await adapter.connect('cip30:nami')
		const accountAddress = connection!.accounts[0].accountAddress
		expect(connection?.accounts[0]?.capabilities).toContain(WalletCapability.SignMessage)
		expect(connection?.scopes[0]?.methods).toContain('signData')
		expect(connection?.accounts[0]?.capabilities).toContain(WalletCapability.SignTransaction)

		await expect(adapter.signMessage?.(
			'cip30:nami',
			accountAddress,
			'Sign this Cardano challenge'
		)).resolves.toBe('cip30-signature')
		expect(signData).toHaveBeenCalledWith(
			mainnetAddress,
			expect.stringMatching(/^0x/)
		)
	})
})
