import { afterEach, describe, expect, it, vi } from 'vitest'

import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { createAptosAip62Adapter } from './aptosAip62.ts'
import type { WalletCandidate, WalletConnection } from './types.ts'

const canonicalAccountA = '0x00000000000000000000000000000000000000000000000000000000000a11ce'
const canonicalAccountB = '0x0000000000000000000000000000000000000000000000000000000000000b0b'

const createSyntheticAip62Wallet = () => {
	let onAccountChange = (_account: { address: string } | null) => {}
	let onNetworkChange = (_network: { name: string, chainId: number }) => {}
	let account = { address: '0xA11CE' }
	let network = {
		name: 'mainnet',
		chainId: 1,
	}
	let rejected = false
	const wallet = {
		name: 'Petra',
		icon: 'data:image/svg+xml;base64,PHN2Zy8+',
		features: {
			'aptos:connect': {
				version: '1.0.0' as const,
				connect: vi.fn(async () => (
					rejected ?
						{ status: 'Rejected' as const }
					:
						{
							status: 'Approved' as const,
							args: account,
						}
				)),
			},
			'aptos:disconnect': {
				version: '1.0.0' as const,
				disconnect: vi.fn(async () => {}),
			},
			'aptos:account': {
				version: '1.0.0' as const,
				account: vi.fn(async () => account),
			},
			'aptos:network': {
				version: '1.0.0' as const,
				network: vi.fn(async () => network),
			},
			'aptos:onAccountChange': {
				version: '1.0.0' as const,
				onAccountChange: vi.fn(async (listener: typeof onAccountChange) => {
					onAccountChange = listener
				}),
			},
			'aptos:onNetworkChange': {
				version: '1.0.0' as const,
				onNetworkChange: vi.fn(async (listener: typeof onNetworkChange) => {
					onNetworkChange = listener
				}),
			},
			'aptos:signMessage': {
				version: '1.0.0' as const,
				signMessage: vi.fn(async () => ({
					status: 'Approved' as const,
					args: {
						signature: '0xaptos-signature',
					},
				})),
			},
			'aptos:signTransaction': {
				version: '1.0.0' as const,
				signTransaction: vi.fn(async () => ({})),
			},
		},
	}

	return {
		accountChange: (nextAccount: typeof account | null) => {
			if (nextAccount != null)
				account = nextAccount
			onAccountChange(nextAccount)
		},
		networkChange: (nextNetwork: typeof network) => {
			network = nextNetwork
			onNetworkChange(nextNetwork)
		},
		rejectNextConnect: () => {
			rejected = true
		},
		approveNextConnect: () => {
			rejected = false
		},
		wallet,
	}
}

const setup = () => {
	let registry: {
		register(...wallets: {
			readonly name: string
			readonly icon: string
			readonly features: Readonly<Record<string, object>>
		}[]): () => void
	} | undefined
	const eventTarget = new EventTarget()
	eventTarget.addEventListener('wallet-standard:app-ready', (event) => {
		registry = (event as CustomEvent<typeof registry>).detail
	})
	vi.stubGlobal('window', eventTarget)

	return {
		announce: (...wallets: Parameters<NonNullable<typeof registry>['register']>) => {
			let unregister = () => {}
			eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
				detail: (nextRegistry) => {
					unregister = nextRegistry.register(...wallets)
				},
			}))

			return () => unregister()
		},
		announceBeforeApp: (...wallets: Parameters<NonNullable<typeof registry>['register']>) => {
			let unregister = () => {}
			eventTarget.addEventListener('wallet-standard:app-ready', (event) => {
				unregister = (event as CustomEvent<NonNullable<typeof registry>>).detail.register(...wallets)
			})

			return () => unregister()
		},
	}
}

describe('Aptos AIP-62 discovery adapter', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('discovers wallets registered before and after app readiness without connecting', async () => {
		const discovery = setup()
		const beforeAppWallet = createSyntheticAip62Wallet().wallet
		const afterAppWallet = createSyntheticAip62Wallet().wallet
		const beforeApp = {
			...beforeAppWallet,
		}
		const afterApp = {
			...afterAppWallet,
			name: 'Nightly',
			icon: 'data:image/png;base64,AA==',
		}
		const candidates: WalletCandidate[][] = []
		const adapter = createAptosAip62Adapter()
		const unregisterBeforeApp = discovery.announceBeforeApp(beforeApp)
		const stop = adapter.start((nextCandidates) => candidates.push(nextCandidates))
		discovery.announce(afterApp)
		expect(candidates.at(-1)?.flatMap(({ capabilities }) => capabilities)).not.toContain(
			WalletCapability.SignTransaction
		)

		expect(candidates.at(-1)).toEqual([
			{
				id: 'aptos-aip62:Petra',
				name: 'Petra',
				icon: beforeApp.icon,
				protocol: WalletProtocol.AptosAip62,
				discoveryKind: WalletDiscoveryKind.InjectedEvent,
				transportKind: WalletTransportKind.InjectedSigner,
				capabilities: expect.arrayContaining([
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Disconnect,
				]),
			},
			{
				id: 'aptos-aip62:Nightly',
				name: 'Nightly',
				icon: afterApp.icon,
				protocol: WalletProtocol.AptosAip62,
				discoveryKind: WalletDiscoveryKind.InjectedEvent,
				transportKind: WalletTransportKind.InjectedSigner,
				capabilities: expect.arrayContaining([
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Disconnect,
				]),
			},
		])
		await expect(adapter.connect('aptos-aip62:Petra')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			accounts: [
				expect.objectContaining({
					accountAddress: canonicalAccountA,
				}),
			],
		})

		stop()
		unregisterBeforeApp()
	})

	it('filters incomplete wallets, deduplicates object registration, and honors unregister', () => {
		const discovery = setup()
		const candidates: WalletCandidate[][] = []
		const adapter = createAptosAip62Adapter()
		adapter.start((nextCandidates) => candidates.push(nextCandidates))
		const wallet = createSyntheticAip62Wallet().wallet
		const unregister = discovery.announce(
			wallet,
			wallet,
			{
				name: 'Legacy Aptos global',
				icon: '',
				features: {
					'aptos:connect': {},
				},
			}
		)

		expect(candidates.at(-1)?.map(({ id }) => id)).toEqual([
			'aptos-aip62:Petra',
		])

		unregister()
		expect(candidates.at(-1)).toEqual([])
	})

	it('keeps same-name wallet objects independently addressable', () => {
		const discovery = setup()
		const candidates: WalletCandidate[][] = []
		createAptosAip62Adapter().start((nextCandidates) => candidates.push(nextCandidates))
		discovery.announce(
			{
				...createSyntheticAip62Wallet().wallet,
				name: 'Shared name',
				icon: '',
			},
			{
				...createSyntheticAip62Wallet().wallet,
				name: 'Shared name',
				icon: '',
			}
		)

		expect(candidates.at(-1)?.map(({ id }) => id)).toEqual([
			'aptos-aip62:Shared name',
			'aptos-aip62:Shared name:2',
		])
	})

	it('keeps rejected approval unselected and allows an explicit retry', async () => {
		const discovery = setup()
		const synthetic = createSyntheticAip62Wallet()
		const adapter = createAptosAip62Adapter()
		adapter.start(() => {})
		discovery.announce(synthetic.wallet)
		synthetic.rejectNextConnect()

		await expect(adapter.connect('aptos-aip62:Petra')).rejects.toThrow(
			'Petra rejected Aptos account access'
		)

		synthetic.approveNextConnect()
		await expect(adapter.connect('aptos-aip62:Petra')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			accounts: [
				expect.objectContaining({
					accountAddress: canonicalAccountA,
				}),
			],
		})
		expect(synthetic.wallet.features['aptos:connect'].connect).toHaveBeenCalledTimes(2)
	})

	it('maps approved account changes and delegates explicit disconnect', async () => {
		const discovery = setup()
		const synthetic = createSyntheticAip62Wallet()
		const adapter = createAptosAip62Adapter()
		adapter.start(() => {})
		discovery.announce(synthetic.wallet)
		await adapter.connect('aptos-aip62:Petra')
		const updates: WalletConnection[] = []
		const unsubscribe = adapter.subscribeConnection(
			'aptos-aip62:Petra',
			(connection) => updates.push(connection)
		)

		expect(synthetic.wallet.features['aptos:account'].account).not.toHaveBeenCalled()
		synthetic.accountChange({
			address: '0xB0B',
		})
		await vi.waitFor(() => expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			accounts: [
				expect.objectContaining({
					accountAddress: canonicalAccountB,
					namespace: 'aptos',
					reference: '1',
				}),
			],
		}))
		synthetic.networkChange({
			name: 'testnet',
			chainId: 2,
		})
		expect(updates.at(-1)).toMatchObject({
			scopes: [
				expect.objectContaining({
					reference: '2',
				}),
			],
			accounts: [
				expect.objectContaining({
					accountAddress: canonicalAccountB,
					reference: '2',
				}),
			],
		})
		synthetic.accountChange(null)
		await vi.waitFor(() => expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Disconnected,
			accounts: [],
		}))

		const updateCount = updates.length
		unsubscribe()
		synthetic.accountChange({
			address: '0xCAFE',
		})
		await Promise.resolve()
		expect(updates).toHaveLength(updateCount)

		await adapter.disconnect('aptos-aip62:Petra')
		expect(synthetic.wallet.features['aptos:disconnect'].disconnect).toHaveBeenCalledOnce()
	})

	it('silently restores only when subscribed for an existing persisted connection', async () => {
		const discovery = setup()
		const synthetic = createSyntheticAip62Wallet()
		const adapter = createAptosAip62Adapter()
		adapter.start(() => {})
		discovery.announce(synthetic.wallet)
		const updates: WalletConnection[] = []

		expect(synthetic.wallet.features['aptos:connect'].connect).not.toHaveBeenCalled()
		const unsubscribe = adapter.subscribeConnection(
			'aptos-aip62:Petra',
			(connection) => updates.push(connection)
		)

		await vi.waitFor(() => expect(updates.at(-1)).toMatchObject({
			status: BlockheadConnectionStatus.Connected,
			selected: true,
			accounts: [
				expect.objectContaining({
					accountAddress: canonicalAccountA,
					reference: '1',
				}),
			],
		}))
		expect(synthetic.wallet.features['aptos:connect'].connect).toHaveBeenCalledWith(true)

		unsubscribe()
	})

	it('signs messages through aptos:signMessage when connected', async () => {
		const discovery = setup()
		const synthetic = createSyntheticAip62Wallet()
		const adapter = createAptosAip62Adapter()
		adapter.start(() => {})
		discovery.announce(synthetic.wallet)
		await adapter.connect('aptos-aip62:Petra')

		await expect(adapter.signMessage?.(
			'aptos-aip62:Petra',
			canonicalAccountA,
			'Sign this Aptos challenge'
		)).resolves.toBe('0xaptos-signature')

		expect(synthetic.wallet.features['aptos:signMessage'].signMessage).toHaveBeenCalledWith({
			message: 'Sign this Aptos challenge',
			nonce: expect.any(String),
			account: expect.objectContaining({
				address: '0xA11CE',
				chains: ['aptos:1'],
				features: expect.arrayContaining(['aptos:signMessage']),
			}),
		})
	})

	it('rejects signMessage when the wallet rejects aptos:signMessage', async () => {
		const discovery = setup()
		const synthetic = createSyntheticAip62Wallet()
		const adapter = createAptosAip62Adapter()
		adapter.start(() => {})
		discovery.announce(synthetic.wallet)
		await adapter.connect('aptos-aip62:Petra')
		synthetic.wallet.features['aptos:signMessage'].signMessage.mockResolvedValueOnce({
			status: 'Rejected',
		})

		await expect(adapter.signMessage?.(
			'aptos-aip62:Petra',
			canonicalAccountA,
			'hello'
		)).rejects.toThrow('Petra rejected message signing')
	})

	it('rejects an empty approved aptos:signMessage response', async () => {
		const discovery = setup()
		const synthetic = createSyntheticAip62Wallet()
		const adapter = createAptosAip62Adapter()
		adapter.start(() => {})
		discovery.announce(synthetic.wallet)
		await adapter.connect('aptos-aip62:Petra')
		synthetic.wallet.features['aptos:signMessage'].signMessage.mockResolvedValueOnce({
			status: 'Approved',
			args: { signature: '' },
		})

		await expect(adapter.signMessage?.(
			'aptos-aip62:Petra',
			canonicalAccountA,
			'hello'
		)).rejects.toThrow('invalid aptos:signMessage signature')
	})

	it('fences a delayed connection across unregister and same-name replacement', async () => {
		const discovery = setup()
		const first = createSyntheticAip62Wallet()
		const pending = Promise.withResolvers<{
			status: 'Approved'
			args: { address: string }
		}>()
		first.wallet.features['aptos:connect'].connect.mockImplementationOnce(() => pending.promise)
		const adapter = createAptosAip62Adapter()
		adapter.start(() => {})
		const unregister = discovery.announce(first.wallet)
		const connecting = adapter.connect('aptos-aip62:Petra')

		unregister()
		const replacement = createSyntheticAip62Wallet()
		discovery.announce(replacement.wallet)
		pending.resolve({
			status: 'Approved',
			args: { address: '0xA11CE' },
		})

		await expect(connecting).rejects.toThrow('registration changed')
		await expect(adapter.connect('aptos-aip62:Petra')).resolves.toMatchObject({
			status: BlockheadConnectionStatus.Connected,
		})
	})
})
