import { describe, expect, it, vi } from 'vitest'

import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
	walletConnectionMethodByProtocolDiscoveryKindTransportKind,
} from '$/constants/Wallet.ts'
import {
	createNearWalletSelectorAdapter,
	type NearSelectorAccount,
	type NearSelectorEvents,
	type NearSelectorModule,
	type NearSelectorWallet,
	type NearWalletSelectorLike,
} from './nearWalletSelector.ts'

type EventName = keyof NearSelectorEvents
type EventPayload = NearSelectorEvents[EventName]
type EventListener = {
	handle(event: EventPayload): void
}

const setup = () => {
	let accounts: readonly NearSelectorAccount[] = [{
		accountId: 'alice.testnet',
		publicKey: 'ed25519:alice',
	}]
	let networkId = 'testnet'
	let modules: NearSelectorModule[] = [{
		id: 'nightly',
		type: 'injected' as const,
		metadata: {
			name: 'Nightly',
			iconUrl: 'nightly.svg',
			available: true,
			deprecated: false,
		},
	}]
	let stateAccounts: (NearSelectorAccount & { active: boolean })[] = [{
		accountId: 'alice.testnet',
		active: true,
	}]
	let selectedWalletId: string | null = 'nightly'
	const listeners = new Map<EventName, Set<EventListener>>()
	const removeByEvent = new Map<EventName, ReturnType<typeof vi.fn>>()
	let deferNextRead = false
	const pendingReads: ((nextAccounts: readonly NearSelectorAccount[]) => void)[] = []
	let deferNextSignIn = false
	let emitSignedInBeforeResolve = false
	const pendingSignIns: ((nextAccounts: readonly NearSelectorAccount[]) => void)[] = []
	let deferNextSignOut = false
	const pendingSignOuts: (() => void)[] = []
	let deferNextWalletLookup = false
	const pendingWalletLookups: ((wallet: NearSelectorWallet) => void)[] = []
	const emit = <EventName extends keyof NearSelectorEvents>(
		eventName: EventName,
		event: NearSelectorEvents[EventName]
	) => {
		for (const listener of listeners.get(eventName) ?? [])
			listener.handle(event)
	}
	const getAccounts = vi.fn(() => {
		const snapshot = accounts
		if (!deferNextRead)
			return Promise.resolve(snapshot)
		deferNextRead = false
		return new Promise<readonly NearSelectorAccount[]>((resolve) => {
			pendingReads.push(resolve)
		})
	})
	const signIn = vi.fn(async () => {
		const snapshot = accounts
		if (emitSignedInBeforeResolve)
			emit('signedIn', { walletId: 'nightly', accounts: snapshot })
		if (!deferNextSignIn)
			return snapshot
		deferNextSignIn = false
		return new Promise<readonly NearSelectorAccount[]>((resolve) => {
			pendingSignIns.push(resolve)
		})
	})
	const signOut = vi.fn(() => {
		if (!deferNextSignOut)
			return Promise.resolve()
		deferNextSignOut = false
		return new Promise<void>((resolve) => {
			pendingSignOuts.push(resolve)
		})
	})
	const wallet: NearSelectorWallet = { getAccounts, signIn, signOut }
	const selector: NearWalletSelectorLike = {
		options: { network: { networkId } },
		store: {
			getState: () => ({
				modules: [
					...modules,
					{
						id: 'not-installed',
						type: 'browser',
						metadata: {
							name: 'Not installed',
							iconUrl: 'missing.svg',
							available: false,
							deprecated: false,
						},
					},
				],
				accounts: stateAccounts,
				selectedWalletId,
			}),
		},
		wallet: vi.fn(() => {
			if (!deferNextWalletLookup)
				return Promise.resolve(wallet)
			deferNextWalletLookup = false
			return new Promise<NearSelectorWallet>((resolve) => {
				pendingWalletLookups.push(resolve)
			})
		}),
		on: <EventName extends keyof NearSelectorEvents>(
			eventName: EventName,
			listener: (event: NearSelectorEvents[EventName]) => void
		) => {
			const eventListeners = listeners.get(eventName) ?? new Set()
			const eventListener: EventListener = {
				handle(event: NearSelectorEvents[EventName]) {
					listener(event)
				},
			}
			eventListeners.add(eventListener)
			listeners.set(eventName, eventListeners)
			const remove = vi.fn(() => {
				eventListeners.delete(eventListener)
			})
			removeByEvent.set(eventName, remove)
			return { remove }
		},
	}

	return {
		adapter: createNearWalletSelectorAdapter(selector),
		getAccounts,
		signIn,
		signOut,
		emit,
		setAccounts: (nextAccounts: readonly NearSelectorAccount[]) => {
			accounts = nextAccounts
			stateAccounts = nextAccounts.map((account, index) => ({
				...account,
				active: index === 0,
			}))
		},
		setActiveAccount: (accountId: string) => {
			stateAccounts = accounts.map((account) => ({
				...account,
				active: account.accountId === accountId,
			}))
		},
		setStateAccounts: (nextStateAccounts: (NearSelectorAccount & { active: boolean })[]) => {
			stateAccounts = nextStateAccounts
		},
		setSelectedWalletId: (nextSelectedWalletId: string | null) => {
			selectedWalletId = nextSelectedWalletId
		},
		setModules: (nextModules: typeof modules) => {
			modules = nextModules
		},
		setNetwork: (nextNetworkId: string) => {
			networkId = nextNetworkId
		},
		deferNextRead: () => {
			deferNextRead = true
		},
		resolvePendingRead: (nextAccounts: readonly NearSelectorAccount[]) => {
			pendingReads.shift()?.(nextAccounts)
		},
		deferNextSignIn: () => {
			deferNextSignIn = true
		},
		emitSignedInBeforeResolve: () => {
			emitSignedInBeforeResolve = true
		},
		resolvePendingSignIn: (nextAccounts: readonly NearSelectorAccount[]) => {
			pendingSignIns.shift()?.(nextAccounts)
		},
		deferNextSignOut: () => {
			deferNextSignOut = true
		},
		resolvePendingSignOut: () => {
			pendingSignOuts.shift()?.()
		},
		deferNextWalletLookup: () => {
			deferNextWalletLookup = true
		},
		resolvePendingWalletLookup: () => {
			pendingWalletLookups.shift()?.(wallet)
		},
		listeners,
		removeByEvent,
	}
}

describe('NEAR Wallet Selector adapter', () => {
	it('discovers configured available modules and projects the active NEAR account exactly', async () => {
		const { adapter, signIn } = setup()
		const candidates: Parameters<Parameters<typeof adapter.start>[0]>[0][] = []
		const stop = adapter.start((nextCandidates) => candidates.push(nextCandidates))
		const [candidate] = candidates[0]

		expect(candidates).toEqual([[
			expect.objectContaining({
				id: 'nightly',
				protocol: WalletProtocol.NearWalletSelector,
				discoveryKind: WalletDiscoveryKind.Registry,
				transportKind: WalletTransportKind.NearSelectorModule,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.Disconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.WatchScopes,
				],
			}),
		]])
		expect(walletConnectionMethodByProtocolDiscoveryKindTransportKind[
			[candidate.protocol, candidate.discoveryKind, candidate.transportKind].join(':')
		]).toEqual(expect.objectContaining({ id: 'near-wallet-selector' }))
		const connection = await adapter.connect('nightly')

		expect(signIn).toHaveBeenCalledWith({})
		expect(connection).toEqual(expect.objectContaining({
			status: 'connected',
			protocol: WalletProtocol.NearWalletSelector,
			transportKind: WalletTransportKind.NearSelectorModule,
			scopes: [expect.objectContaining({ namespace: 'near', reference: 'testnet' })],
			accounts: [{
				namespace: 'near',
				reference: 'testnet',
				accountAddress: 'alice.testnet',
				capabilities: [
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.WatchScopes,
				],
			}],
			activeAccount: expect.objectContaining({ accountAddress: 'alice.testnet' }),
			selected: true,
		}))
		stop()
	})

	it('projects the selector-selected account rather than the first returned account', async () => {
		const { adapter, setAccounts, setActiveAccount } = setup()
		const stop = adapter.start(() => {})
		setAccounts([
			{ accountId: 'alice.testnet' },
			{ accountId: 'bob.testnet' },
		])
		setActiveAccount('bob.testnet')

		const connection = await adapter.connect('nightly')

		expect(connection?.activeAccount?.accountAddress).toBe('bob.testnet')
		expect(connection).toEqual(expect.objectContaining({ selected: true }))
		stop()
	})

	it('owns signedIn emitted by signIn before its promise resolves', async () => {
		const { adapter, emitSignedInBeforeResolve, signIn } = setup()
		const updates: string[] = []
		const stop = adapter.start(() => {})
		adapter.subscribeConnection('nightly', (connection) => {
			updates.push(connection.accounts[0]?.accountAddress ?? 'signed-out')
		})
		emitSignedInBeforeResolve()

		const connection = await adapter.connect('nightly')

		expect(signIn).toHaveBeenCalledWith({})
		expect(connection?.accounts[0]?.accountAddress).toBe('alice.testnet')
		expect(updates.at(-1)).toBe('alice.testnet')
		stop()
	})

	it('does not call signIn when disconnect supersedes a delayed wallet lookup', async () => {
		const {
			adapter,
			deferNextWalletLookup,
			resolvePendingWalletLookup,
			signIn,
			signOut,
		} = setup()
		const stop = adapter.start(() => {})
		deferNextWalletLookup()
		const staleConnect = adapter.connect('nightly')

		await adapter.disconnect('nightly')
		expect(signOut).toHaveBeenCalledTimes(1)
		resolvePendingWalletLookup()

		await expect(staleConnect).resolves.toBeUndefined()
		expect(signIn).not.toHaveBeenCalled()
		stop()
	})

	it('does not call signIn from an older delayed lookup after a newer connect', async () => {
		const {
			adapter,
			deferNextWalletLookup,
			resolvePendingWalletLookup,
			signIn,
		} = setup()
		const stop = adapter.start(() => {})
		deferNextWalletLookup()
		const staleConnect = adapter.connect('nightly')
		const currentConnect = adapter.connect('nightly')

		await expect(currentConnect).resolves.toEqual(expect.objectContaining({ status: 'connected' }))
		resolvePendingWalletLookup()
		await expect(staleConnect).resolves.toBeUndefined()
		expect(signIn).toHaveBeenCalledTimes(1)
		stop()
	})

	it('does not call signOut from a delayed lookup after a newer connect', async () => {
		const {
			adapter,
			deferNextWalletLookup,
			resolvePendingWalletLookup,
			signIn,
			signOut,
		} = setup()
		const stop = adapter.start(() => {})
		deferNextWalletLookup()
		const staleDisconnect = adapter.disconnect('nightly')
		const currentConnect = adapter.connect('nightly')

		await expect(currentConnect).resolves.toEqual(expect.objectContaining({ status: 'connected' }))
		resolvePendingWalletLookup()
		await staleDisconnect
		expect(signIn).toHaveBeenCalledTimes(1)
		expect(signOut).not.toHaveBeenCalled()
		stop()
	})

	it('lets accountsChanged supersede a pending connect after its own signedIn event', async () => {
		const {
			adapter,
			deferNextSignIn,
			emit,
			resolvePendingSignIn,
			setAccounts,
		} = setup()
		const updates: string[] = []
		const stop = adapter.start(() => {})
		adapter.subscribeConnection('nightly', (connection) => {
			updates.push(connection.accounts[0]?.accountAddress ?? 'signed-out')
		})
		deferNextSignIn()
		const connectPromise = adapter.connect('nightly')
		await Promise.resolve()
		emit('signedIn', { walletId: 'nightly', accounts: [{ accountId: 'alice.testnet' }] })
		setAccounts([{ accountId: 'bob.testnet' }])
		emit('accountsChanged', { walletId: 'nightly', accounts: [{ accountId: 'bob.testnet' }] })
		resolvePendingSignIn([{ accountId: 'alice.testnet' }])

		await expect(connectPromise).resolves.toBeUndefined()
		expect(updates.at(-1)).toBe('bob.testnet')
		stop()
	})

	it('applies mutable account and network events and cleans up for restart', async () => {
		const {
			adapter,
			emit,
			getAccounts,
			listeners,
			setAccounts,
			setNetwork,
		} = setup()
		const updates: string[] = []
		const stop = adapter.start(() => {})
		const unsubscribe = adapter.subscribeConnection('nightly', (connection) => {
			updates.push(`${connection.scopes[0].reference}:${connection.accounts[0]?.accountAddress ?? 'signed-out'}`)
		})
		await vi.waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1))

		setAccounts([{ accountId: 'bob.testnet' }])
		setNetwork('mainnet')
		emit('accountsChanged', { walletId: 'nightly', accounts: [{ accountId: 'bob.testnet' }] })
		emit('networkChanged', { walletId: 'nightly', networkId: 'mainnet' })
		expect(updates.at(-1)).toBe('mainnet:bob.testnet')

		unsubscribe()
		stop()
		expect([...listeners.values()].every((eventListeners) => eventListeners.size === 0)).toBe(true)

		const restarted = adapter.start(() => {})
		const restartedUpdates: string[] = []
		adapter.subscribeConnection('nightly', (connection) => {
			restartedUpdates.push(connection.scopes[0].reference)
		})
		setAccounts([])
		emit('signedOut', { walletId: 'nightly' })
		expect(restartedUpdates.at(-1)).toBe('testnet')
		restarted()
	})

	it('suppresses a stale account read after an account event', async () => {
		const {
			adapter,
			emit,
			getAccounts,
			setAccounts,
			deferNextRead,
			resolvePendingRead,
		} = setup()
		const updates: string[] = []
		const stop = adapter.start(() => {})
		deferNextRead()
		const unsubscribe = adapter.subscribeConnection('nightly', (connection) => {
			updates.push(connection.accounts[0]?.accountAddress ?? 'signed-out')
		})
		await vi.waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1))

		setAccounts([{ accountId: 'bob.testnet' }])
		emit('accountsChanged', {
			walletId: 'nightly',
			accounts: [{ accountId: 'bob.testnet' }],
		})
		resolvePendingRead([{ accountId: 'alice.testnet' }])
		await Promise.resolve()
		await Promise.resolve()
		expect(updates).toEqual(['bob.testnet'])

		unsubscribe()
		stop()
	})

	it('removes every subscription with remove() and restarts cleanly', () => {
		const { adapter, removeByEvent, emit, setAccounts, setNetwork } = setup()
		const stop = adapter.start(() => {})
		adapter.subscribeConnection('nightly', () => {})

		const firstRemoves = new Map(removeByEvent)
		stop()
		for (const [eventName, remove] of firstRemoves)
			expect(remove, `first ${eventName} remove`).toHaveBeenCalledTimes(1)

		const restart = adapter.start(() => {})
		const restartedUpdates: string[] = []
		adapter.subscribeConnection('nightly', (connection) => {
			restartedUpdates.push(`${connection.scopes[0].reference}:${connection.accounts[0]?.accountAddress ?? 'signed-out'}`)
		})
		setAccounts([{ accountId: 'bob.testnet' }])
		setNetwork('mainnet')
		emit('accountsChanged', { walletId: 'nightly', accounts: [{ accountId: 'bob.testnet' }] })
		emit('networkChanged', { walletId: 'nightly', networkId: 'mainnet' })
		expect(restartedUpdates.at(-1)).toBe('mainnet:bob.testnet')

		const secondRemoves = new Map(removeByEvent)
		restart()
		for (const [, remove] of secondRemoves)
			expect(remove).toHaveBeenCalledTimes(1)

		// first stop is idempotent and does not remove again
		stop()
		for (const [, remove] of firstRemoves)
			expect(remove).toHaveBeenCalledTimes(1)
	})

	it('stale connect after stop and restart is inert', async () => {
		const {
			adapter,
			getAccounts,
			deferNextSignIn,
			resolvePendingSignIn,
			deferNextRead,
			resolvePendingRead,
			setAccounts,
		} = setup()
		const stop = adapter.start(() => {})
		deferNextSignIn()
		const connectPromise = adapter.connect('nightly')

		stop()
		const restart = adapter.start(() => {})
		deferNextRead()
		const updates: string[] = []
		adapter.subscribeConnection('nightly', (connection) => {
			updates.push(`${connection.scopes[0].reference}:${connection.accounts[0]?.accountAddress ?? 'signed-out'}`)
		})
		await vi.waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1))

		resolvePendingSignIn([{ accountId: 'stale.testnet' }])
		const staleConnection = await connectPromise
		expect(staleConnection).toBeUndefined()

		setAccounts([{ accountId: 'bob.testnet' }])
		resolvePendingRead([{ accountId: 'bob.testnet' }])
		await Promise.resolve()
		await Promise.resolve()
		expect(updates).toEqual(['testnet:bob.testnet'])

		restart()
	})

	it('invalidates a pending connect before awaiting signOut', async () => {
		const {
			adapter,
			deferNextSignIn,
			emit,
			resolvePendingSignIn,
			deferNextSignOut,
			resolvePendingSignOut,
			setSelectedWalletId,
			signIn,
			signOut,
		} = setup()
		const stop = adapter.start(() => {})
		setSelectedWalletId(null)
		deferNextSignIn()
		const connectPromise = adapter.connect('nightly')
		await vi.waitFor(() => expect(signIn).toHaveBeenCalledTimes(1))
		emit('signedIn', { walletId: 'nightly', accounts: [{ accountId: 'stale.testnet' }] })

		deferNextSignOut()
		const disconnectPromise = adapter.disconnect('nightly')
		await vi.waitFor(() => expect(signOut).toHaveBeenCalledTimes(1))
		resolvePendingSignIn([{ accountId: 'stale.testnet' }])

		await expect(connectPromise).resolves.toBeUndefined()
		resolvePendingSignOut()
		await disconnectPromise
		stop()
	})

	it('does not advertise hardware modules that require signIn accounts', () => {
		const { adapter, setModules } = setup()
		setModules([{
			id: 'ledger',
			type: 'hardware',
			metadata: {
				name: 'Ledger',
				iconUrl: 'ledger.svg',
				available: true,
				deprecated: false,
			},
		}])
		const candidates: string[][] = []

		const stop = adapter.start((nextCandidates) => {
			candidates.push(nextCandidates.map((candidate) => candidate.id))
		})

		expect(candidates).toEqual([[]])
		stop()
	})

	it('does not reuse a pre-disconnect read fence for a later same-generation subscription', async () => {
		const {
			adapter,
			getAccounts,
			deferNextRead,
			resolvePendingRead,
			deferNextSignOut,
			resolvePendingSignOut,
			setSelectedWalletId,
			signOut,
		} = setup()
		const updates: string[] = []
		const updateConnection: Parameters<typeof adapter.subscribeConnection>[1] = (connection) => {
			updates.push(connection.accounts[0]?.accountAddress ?? 'signed-out')
		}
		const stop = adapter.start(() => {})
		setSelectedWalletId(null)
		deferNextRead()
		adapter.subscribeConnection('nightly', updateConnection)
		await vi.waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1))

		deferNextSignOut()
		const disconnectPromise = adapter.disconnect('nightly')
		await vi.waitFor(() => expect(signOut).toHaveBeenCalledTimes(1))
		resolvePendingSignOut()
		await disconnectPromise

		deferNextRead()
		adapter.subscribeConnection('nightly', updateConnection)
		await vi.waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(2))
		resolvePendingRead([{ accountId: 'stale.testnet' }])
		await Promise.resolve()
		await Promise.resolve()
		expect(updates).toEqual([])

		resolvePendingRead([{ accountId: 'bob.testnet' }])
		await Promise.resolve()
		await Promise.resolve()
		expect(updates).toEqual(['bob.testnet'])
		stop()
	})

	it('does not let delayed disconnect completion clear a reconnect epoch', async () => {
		const {
			adapter,
			getAccounts,
			deferNextRead,
			resolvePendingRead,
			deferNextSignOut,
			resolvePendingSignOut,
			setSelectedWalletId,
			signOut,
		} = setup()
		const updates: string[] = []
		const stop = adapter.start(() => {})
		setSelectedWalletId(null)

		deferNextSignOut()
		const disconnectPromise = adapter.disconnect('nightly')
		await vi.waitFor(() => expect(signOut).toHaveBeenCalledTimes(1))

		deferNextRead()
		adapter.subscribeConnection('nightly', (connection) => {
			updates.push(connection.accounts[0]?.accountAddress ?? 'signed-out')
		})
		await vi.waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1))
		resolvePendingRead([{ accountId: 'reconnected.testnet' }])
		await Promise.resolve()
		await Promise.resolve()
		expect(updates).toEqual(['reconnected.testnet'])

		resolvePendingSignOut()
		await disconnectPromise

		adapter.subscribeConnection('nightly', (connection) => {
			updates.push(connection.accounts[0]?.accountAddress ?? 'signed-out')
		})
		expect(updates).toEqual(['reconnected.testnet', 'reconnected.testnet'])
		stop()
	})

	it('network change before initial account read eventually emits the correct connected account and network', async () => {
		const {
			adapter,
			getAccounts,
			deferNextRead,
			resolvePendingRead,
			emit,
			setAccounts,
		} = setup()
		const stop = adapter.start(() => {})
		const updates: string[] = []
		deferNextRead()
		adapter.subscribeConnection('nightly', (connection) => {
			updates.push(`${connection.scopes[0].reference}:${connection.accounts[0]?.accountAddress ?? 'signed-out'}`)
		})
		await vi.waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1))

		setAccounts([{ accountId: 'bob.testnet' }])
		emit('networkChanged', { walletId: 'nightly', networkId: 'mainnet' })
		expect(updates).toEqual([])

		resolvePendingRead([{ accountId: 'bob.testnet' }])
		await Promise.resolve()
		await Promise.resolve()
		expect(updates).toEqual(['mainnet:bob.testnet'])

		stop()
	})

	it('does not derive active account from a different selected wallet', async () => {
		const { adapter, setAccounts, setStateAccounts, setSelectedWalletId } = setup()
		setSelectedWalletId('other-wallet')
		setAccounts([{ accountId: 'alice.testnet' }])
		setStateAccounts([{ accountId: 'not a valid id', active: true }])

		const stop = adapter.start(() => {})
		const connection = await adapter.connect('nightly')

		expect(connection).toEqual(expect.objectContaining({
			status: 'connected',
			accounts: [expect.objectContaining({ accountAddress: 'alice.testnet' })],
			selected: false,
		}))
		expect(connection?.activeAccount?.accountAddress).toBe('alice.testnet')
		stop()
	})

	it('ignores events from unconfigured wallet ids', async () => {
		const { adapter, emit, getAccounts } = setup()
		const updates: string[] = []
		const stop = adapter.start(() => {})
		adapter.subscribeConnection('nightly', (connection) => {
			updates.push(connection.accounts[0]?.accountAddress ?? 'signed-out')
		})
		await vi.waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1))

		emit('signedIn', { walletId: 'unknown-wallet', accounts: [{ accountId: 'mallory.testnet' }] })
		emit('accountsChanged', { walletId: 'unknown-wallet', accounts: [{ accountId: 'mallory.testnet' }] })
		emit('networkChanged', { walletId: 'unknown-wallet', networkId: 'mainnet' })
		emit('signedOut', { walletId: 'unknown-wallet' })
		await Promise.resolve()
		await Promise.resolve()
		expect(updates).toEqual(['alice.testnet'])

		stop()
	})

	it('refreshes configured modules on restart and rejects malformed identities', async () => {
		const { adapter, setModules, setAccounts, emit } = setup()
		const candidates: string[][] = []
		const stop = adapter.start((nextCandidates) => {
			candidates.push(nextCandidates.map((candidate) => candidate.id))
		})
		setModules([{
			id: 'my-near-wallet',
			type: 'browser',
			metadata: {
				name: 'My Near Wallet',
				iconUrl: 'my-near-wallet.svg',
				available: true,
				deprecated: false,
			},
		}])
		stop()
		const restarted = adapter.start((nextCandidates) => {
			candidates.push(nextCandidates.map((candidate) => candidate.id))
		})
		expect(candidates).toEqual([['nightly'], ['my-near-wallet']])

		setAccounts([{ accountId: 'not a near account' }])
		await expect(adapter.connect('my-near-wallet')).rejects.toThrow('Invalid NEAR account ID')
		expect(() => emit('networkChanged', {
			walletId: 'my-near-wallet',
			networkId: '',
		})).toThrow('Invalid NEAR network ID')
		restarted()
	})

	it('disconnects through signOut and does not expose transaction or generic message hooks', async () => {
		const { adapter, signOut } = setup()
		adapter.start(() => {})

		expect(adapter).not.toHaveProperty('signAndSendTransaction')
		expect(adapter).not.toHaveProperty('signMessage')
		await adapter.disconnect('nightly')
		expect(signOut).toHaveBeenCalledTimes(1)
	})
})
