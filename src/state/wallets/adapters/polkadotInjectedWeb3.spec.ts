import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { createPolkadotInjectedWeb3Adapter } from './polkadotInjectedWeb3.ts'
import type { WalletCandidate, WalletConnection } from './types.ts'

const polkadotAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
const genericAliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
const kusamaAddress = 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F'

describe('Polkadot injectedWeb3 wallet adapter', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('exposes only implemented lifecycle capabilities and chain-scoped accounts', async () => {
		vi.stubGlobal('window', {
			injectedWeb3: {
				polkadotjs: {
					enable: vi.fn(async () => ({
						accounts: {
							get: async () => [
								{
									address: genericAliceAddress,
									genesisHash: '0x91B171BB158E2D3848FA23A9F1C25182D',
								},
								{
									address: polkadotAddress,
									genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182',
								},
							],
							subscribe: () => () => {},
						},
					})),
				},
			},
		})
		const candidates: WalletCandidate[][] = []
		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start((nextCandidates) => candidates.push(nextCandidates))

		expect(candidates[0]?.[0]?.capabilities).toEqual([
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
		])
		expect(await adapter.connect('polkadot:polkadotjs')).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			activeAccount: expect.objectContaining({
				accountAddress: polkadotAddress,
				reference: '91b171bb158e2d3848fa23a9f1c25182',
			}),
			accounts: [expect.objectContaining({
				accountAddress: polkadotAddress,
			})],
			scopes: [expect.objectContaining({
				methods: ['enable', 'accounts.get'],
				events: ['accounts.subscribe'],
			})],
		}))
	})

	it('silently re-enables and restores multiple chain-scoped accounts after reload', async () => {
		let updateAccounts = (_accounts: {
			address: string
			genesisHash?: string | null
		}[]) => {}
		const unsubscribe = vi.fn()
		const enable = vi.fn(async () => ({
			accounts: {
				get: async () => [
					{
						address: genericAliceAddress,
						genesisHash: '0x91b171bb158e2d3848fa23A9F1C25182d',
					},
					{
						address: kusamaAddress,
						genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f',
					},
				],
				subscribe: (callback: typeof updateAccounts) => {
					updateAccounts = callback

					return unsubscribe
				},
			},
		}))
		vi.stubGlobal('window', {
			injectedWeb3: {
				talisman: { enable },
			},
		})
		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})
		const restoreUpdates: WalletConnection[] = []
		const restoreCleanup = adapter.subscribeConnection(
			'polkadot:talisman',
			(connection) => restoreUpdates.push(connection)
		)

		await vi.waitFor(() => expect(restoreUpdates).toHaveLength(1))
		expect(enable).toHaveBeenCalledWith('Blockhead')
		expect(restoreUpdates[0]).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Connected,
			accounts: [
				expect.objectContaining({
					accountAddress: polkadotAddress,
					reference: '91b171bb158e2d3848fa23a9f1c25182',
				}),
				expect.objectContaining({
					accountAddress: kusamaAddress,
					reference: 'b0a8d493285c2df73290dfb7e61f870f',
				}),
			],
		}))

		updateAccounts([{
			address: kusamaAddress,
			genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f',
		}])
		expect(restoreUpdates.at(-1)?.activeAccount).toEqual(expect.objectContaining({
			accountAddress: kusamaAddress,
			reference: 'b0a8d493285c2df73290dfb7e61f870f',
		}))

		updateAccounts([])
		expect(restoreUpdates.at(-1)).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
			selected: false,
			disconnectedAt: expect.any(Number),
		}))
		expect(restoreUpdates.at(-1)).not.toHaveProperty('activeAccount')

		restoreCleanup()
		expect(unsubscribe).toHaveBeenCalledOnce()
	})

	it('preserves enable approval rejection and keeps disconnect local', async () => {
		const rejection = new Error('Extension authorization rejected')
		const enable = vi.fn(async () => {
			throw rejection
		})
		vi.stubGlobal('window', {
			injectedWeb3: {
				polkadotjs: { enable },
			},
		})
		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})

		await expect(adapter.connect('polkadot:polkadotjs')).rejects.toBe(rejection)
		await adapter.disconnect('polkadot:polkadotjs')
		expect(enable).toHaveBeenCalledOnce()
	})

	it('ignores malformed or missing genesis scope identity', async () => {
		vi.stubGlobal('window', {
			injectedWeb3: {
				talisman: {
					enable: vi.fn(async () => ({
						accounts: {
							get: async () => [
								{
									address: genericAliceAddress,
								},
								{
									address: genericAliceAddress,
									genesisHash: 'not-a-genesis-hash',
								},
								{
									address: `${polkadotAddress.slice(0, -1)}6`,
									genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182',
								},
								{
									address: 'not-base58-0',
									genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182',
								},
							],
							subscribe: () => () => {},
						},
					})),
				},
			},
		})
		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})

		await expect(adapter.connect('polkadot:talisman')).resolves.toEqual(
			expect.objectContaining({
				status: BlockheadConnectionStatus.Disconnected,
				scopes: [],
				accounts: [],
				selected: false,
			})
		)
	})

	it('cancels cold re-enable before attaching an account listener', async () => {
		const enable = Promise.withResolvers<{
			accounts: {
				get(): Promise<{
					address: string
					genesisHash: string
				}[]>
				subscribe(callback: () => void): () => void
			}
		}>()
		const unsubscribe = vi.fn()
		const subscribe = vi.fn(() => unsubscribe)
		vi.stubGlobal('window', {
			injectedWeb3: {
				talisman: {
					enable: vi.fn(() => enable.promise),
				},
			},
		})
		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const cleanup = adapter.subscribeConnection(
			'polkadot:talisman',
			(connection) => updates.push(connection)
		)

		cleanup()
		enable.resolve({
			accounts: {
				get: async () => [{
					address: genericAliceAddress,
					genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182d',
				}],
				subscribe,
			},
		})
		await enable.promise
		await Promise.resolve()

		expect(subscribe).not.toHaveBeenCalled()
		expect(unsubscribe).not.toHaveBeenCalled()
		expect(updates).toEqual([])
	})

	it('does not let a stale initial read overwrite a newer account subscription', async () => {
		const initialAccounts = Promise.withResolvers<{
			address: string
			genesisHash: string
		}[]>()
		let updateAccounts = (_accounts: {
			address: string
			genesisHash: string
		}[]) => {}
		const subscribe = vi.fn((callback: typeof updateAccounts) => {
			updateAccounts = callback

			return () => {}
		})
		vi.stubGlobal('window', {
			injectedWeb3: {
				talisman: {
					enable: vi.fn(async () => ({
						accounts: {
							get: () => initialAccounts.promise,
							subscribe,
						},
					})),
				},
			},
		})
		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})
		const updates: WalletConnection[] = []
		const cleanup = adapter.subscribeConnection(
			'polkadot:talisman',
			(connection) => updates.push(connection)
		)
		await vi.waitFor(() => expect(subscribe).toHaveBeenCalledOnce())
		updateAccounts([{
			address: kusamaAddress,
			genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f',
		}])
		initialAccounts.resolve([{
			address: genericAliceAddress,
			genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182d',
		}])
		await initialAccounts.promise
		await Promise.resolve()

		expect(updates).toEqual([
			expect.objectContaining({
				accounts: [expect.objectContaining({ accountAddress: kusamaAddress })],
			}),
		])

		cleanup()
	})
})
