import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
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
		const get = vi.fn(async () => [
			{
				address: genericAliceAddress,
				genesisHash: null,
			},
			{
				address: polkadotAddress,
			},
		])
		vi.stubGlobal('window', {
			injectedWeb3: {
				polkadotjs: {
					enable: vi.fn(async () => ({
						accounts: {
							get,
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
		expect(get).toHaveBeenCalledWith(
			undefined,
			'0x91b171bb158e2d3848fa23a9f1c25182'
		)
	})

	it('discovers delayed injected globals once and deduplicates alias sources', async () => {
		vi.useFakeTimers()
		const wallet = {
			enable: vi.fn(async () => ({
				accounts: {
					get: async () => [],
					subscribe: () => () => {},
				},
			})),
		}
		const injectedWindow: {
			injectedWeb3?: Record<string, typeof wallet>
		} = {}
		vi.stubGlobal('window', injectedWindow)
		const candidates: WalletCandidate[][] = []
		const cleanup = createPolkadotInjectedWeb3Adapter().start((nextCandidates) => {
			candidates.push(nextCandidates)
		})

		expect(candidates).toEqual([[]])
		injectedWindow.injectedWeb3 = {
			'polkadot-js': wallet,
			polkadotjs: wallet,
		}
		await vi.advanceTimersByTimeAsync(100)
		expect(candidates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'polkadot:polkadot-js',
			}),
		])

		cleanup()
		vi.useRealTimers()
	})

	it('silently re-enables and restores only the authorized chain after reload', async () => {
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
			(connection) => restoreUpdates.push(connection),
			'persisted-polkadot-connection'
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
			],
		}))

		updateAccounts([{
			address: kusamaAddress,
			genesisHash: null,
		}])
		expect(restoreUpdates.at(-1)?.activeAccount).toEqual(expect.objectContaining({
			accountAddress: polkadotAddress,
			reference: '91b171bb158e2d3848fa23a9f1c25182',
		}))

		updateAccounts([])
		expect(restoreUpdates.at(-1)).toEqual(expect.objectContaining({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
			disconnectedAt: expect.any(Number),
		}))
		expect(restoreUpdates.at(-1)).not.toHaveProperty('activeAccount')

		restoreCleanup()
		expect(unsubscribe).toHaveBeenCalledOnce()
	})

	it('preserves enable approval rejection and permits an explicit retry', async () => {
		const rejection = new Error('Extension authorization rejected')
		const enable = vi.fn()
			.mockRejectedValueOnce(rejection)
			.mockResolvedValueOnce({
				accounts: {
					get: async () => [{
						address: genericAliceAddress,
						genesisHash: null,
					}],
					subscribe: () => () => {},
				},
			})
		vi.stubGlobal('window', {
			injectedWeb3: {
				polkadotjs: { enable },
			},
		})
		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})

		await expect(adapter.connect('polkadot:polkadotjs')).rejects.toBe(rejection)
		await expect(adapter.connect('polkadot:polkadotjs')).resolves.toEqual(
			expect.objectContaining({
				status: BlockheadConnectionStatus.Connected,
			})
		)
		expect(enable).toHaveBeenCalledTimes(2)
	})

	it('revokes account update authority on disconnect', async () => {
		let updateAccounts = (_accounts: {
			address: string
			genesisHash?: string | null
		}[]) => {}
		vi.stubGlobal('window', {
			injectedWeb3: {
				polkadotjs: {
					enable: vi.fn(async () => ({
						accounts: {
							get: async () => [{
								address: genericAliceAddress,
								genesisHash: null,
							}],
							subscribe: (callback: typeof updateAccounts) => {
								updateAccounts = callback

								return () => {}
							},
						},
					})),
				},
			},
		})
		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})
		await adapter.connect('polkadot:polkadotjs')
		const updates: WalletConnection[] = []
		adapter.subscribeConnection(
			'polkadot:polkadotjs',
			(connection) => updates.push(connection)
		)

		await adapter.disconnect('polkadot:polkadotjs')
		updateAccounts([{
			address: genericAliceAddress,
			genesisHash: null,
		}])
		expect(updates).toEqual([])
	})

	it('ignores malformed genesis scope identity and addresses', async () => {
		vi.stubGlobal('window', {
			injectedWeb3: {
				talisman: {
					enable: vi.fn(async () => ({
						accounts: {
							get: async () => [
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
			})
		)
	})

	it('does not materialize accounts declared for a different chain', async () => {
		vi.stubGlobal('window', {
			injectedWeb3: {
				talisman: {
					enable: vi.fn(async () => ({
						accounts: {
							get: async () => [
								{
									address: kusamaAddress,
									genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f',
								},
								{
									address: genericAliceAddress,
									genesisHash: null,
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
				status: BlockheadConnectionStatus.Connected,
				accounts: [
					expect.objectContaining({
						accountAddress: polkadotAddress,
						reference: '91b171bb158e2d3848fa23a9f1c25182',
					}),
				],
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
			(connection) => updates.push(connection),
			'persisted-polkadot-connection'
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
			(connection) => updates.push(connection),
			'persisted-polkadot-connection'
		)
		await vi.waitFor(() => expect(subscribe).toHaveBeenCalledOnce())
		updateAccounts([{
			address: genericAliceAddress,
			genesisHash: null,
		}])
		initialAccounts.resolve([{
			address: genericAliceAddress,
			genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182d',
		}])
		await initialAccounts.promise
		await Promise.resolve()

		expect(updates).toEqual([
			expect.objectContaining({
				accounts: [expect.objectContaining({ accountAddress: polkadotAddress })],
			}),
		])

		cleanup()
	})
})
