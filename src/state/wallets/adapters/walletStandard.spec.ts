import { afterEach, describe, expect, it, vi } from 'vitest'
import { WalletCapability } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { base58 } from '@scure/base'
import { createWalletStandardAdapter } from './walletStandard.ts'
import type { WalletCandidate, WalletConnection } from './types.ts'

const solanaMainnetReference = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
const firstSolanaAccount = '11111111111111111111111111111111'
const secondSolanaAccount = 'SysvarRent111111111111111111111111111111111'
const thirdSolanaAccount = 'Vote111111111111111111111111111111111111111'

type ChangeProperties = {
	accounts?: StandardAccount[]
}

type StandardAccount = {
	address: string
	chains: string[]
	features: string[]
}

const account = (
	address = firstSolanaAccount,
	chains = ['solana:mainnet']
): StandardAccount => ({
	address,
	chains,
	features: ['solana:signMessage'],
})

const wallet = ({
	name = 'Standard Wallet',
	connect = vi.fn(async () => ({ accounts: [account()] })),
	disconnect = vi.fn(async () => {}),
	signMessage = vi.fn(async () => [{
		signature: new Uint8Array(64).fill(7),
	}]),
	includeSignMessageFeature = false,
} = {}) => {
	const changeListeners = new Set<(properties: ChangeProperties) => void>()

	return {
		provider: {
			name,
			icon: 'data:image/png;base64,standard',
			accounts: [],
			features: {
				'standard:connect': {
					version: '1.0.0' as const,
					connect,
				},
				'standard:events': {
					version: '1.0.0' as const,
					on: (_event: 'change', listener: (properties: ChangeProperties) => void) => {
						changeListeners.add(listener)
						return () => changeListeners.delete(listener)
					},
				},
				'standard:disconnect': {
					version: '1.0.0' as const,
					disconnect,
				},
				...(includeSignMessageFeature && {
					'solana:signMessage': {
						version: '1.0.0' as const,
						signMessage,
					},
				}),
			},
		},
		emitAccounts: (accounts: StandardAccount[]) => {
			for (const listener of changeListeners) listener({ accounts })
		},
		connect,
		disconnect,
		signMessage,
		listenerCount: () => changeListeners.size,
	}
}

const mountRegistry = () => {
	const eventTarget = new EventTarget()
	vi.stubGlobal('window', Object.assign(eventTarget, {
		setTimeout,
		clearTimeout,
	}))

	const adapter = createWalletStandardAdapter()
	const candidateUpdates: WalletCandidate[][] = []
	let registry: {
		register(...wallets: {
			name: string
			icon?: string
			accounts: StandardAccount[]
			features: Record<string, object>
		}[]): () => void
	} | undefined
	const cleanup = adapter.start((candidates) => candidateUpdates.push(candidates))
	eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
		detail: (walletRegistry: NonNullable<typeof registry>) => {
			registry = walletRegistry
		},
	}))

	return {
		adapter,
		candidateUpdates,
		cleanup,
		register: (...wallets: Parameters<NonNullable<typeof registry>['register']>) => registry?.register(...wallets),
	}
}

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

describe('Wallet Standard adapter', () => {
	it('discovers, unregisters, and distinguishes wallets with the same name', () => {
		const mounted = mountRegistry()
		const firstWallet = wallet()
		const secondWallet = wallet()
		const unregisterFirst = mounted.register(firstWallet.provider)
		mounted.register(secondWallet.provider)

		expect(mounted.candidateUpdates.at(-1)?.map(({ id }) => id)).toEqual([
			'wallet-standard:Standard Wallet',
			'wallet-standard:Standard Wallet:2',
		])
		expect(mounted.candidateUpdates.at(-1)?.[0]?.capabilities).toEqual([
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.Disconnect,
		])

		unregisterFirst?.()
		expect(mounted.candidateUpdates.at(-1)?.map(({ id }) => id)).toEqual([
			'wallet-standard:Standard Wallet:2',
		])
		mounted.cleanup()
	})

	it('normalizes multiple accounts and propagates account and chain changes', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(123)
		const mounted = mountRegistry()
		const standardWallet = wallet({
			connect: vi.fn(async () => ({
				accounts: [
					account(firstSolanaAccount, ['solana:mainnet', 'sui:mainnet']),
					account(firstSolanaAccount, ['solana:mainnet']),
					account(secondSolanaAccount, ['solana:mainnet']),
					account('not a Solana public key', ['solana:mainnet']),
				],
			})),
		})
		mounted.register(standardWallet.provider)

		await expect(mounted.adapter.connect('wallet-standard:Standard Wallet')).resolves.toEqual(
			expect.objectContaining({
				status: BlockheadConnectionStatus.Connected,
				connectedAt: 123,
				accounts: [
					expect.objectContaining({
						namespace: 'solana',
						reference: solanaMainnetReference,
						accountAddress: firstSolanaAccount,
					}),
					expect.objectContaining({
						namespace: 'solana',
						reference: solanaMainnetReference,
						accountAddress: secondSolanaAccount,
					}),
				],
			})
		)

		const connectionUpdates: WalletConnection[] = []
		const unsubscribe = mounted.adapter.subscribeConnection(
			'wallet-standard:Standard Wallet',
			(connection) => connectionUpdates.push(connection)
		)
		standardWallet.emitAccounts([
			account(secondSolanaAccount, ['aptos:mainnet']),
			account(thirdSolanaAccount, ['solana:devnet']),
			account(thirdSolanaAccount, ['solana:mainnet']),
		])
		standardWallet.emitAccounts([])

		expect(connectionUpdates).toEqual([
			expect.objectContaining({
				status: BlockheadConnectionStatus.Connected,
				scopes: [
					expect.objectContaining({
						namespace: 'solana',
						reference: solanaMainnetReference,
					}),
				],
				accounts: [
					expect.objectContaining({
						reference: solanaMainnetReference,
						accountAddress: thirdSolanaAccount,
					}),
				],
			}),
			expect.objectContaining({
				status: BlockheadConnectionStatus.Disconnected,
				accounts: [],
			}),
		])
		unsubscribe()
		expect(standardWallet.listenerCount()).toBe(0)
		mounted.cleanup()
	})

	it('silently restores a connected wallet after a cold adapter reload', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(456)
		const mounted = mountRegistry()
		const connect = vi.fn(async ({ silent }: { silent?: boolean } = {}) => ({
			accounts: silent ?
				[
					account(firstSolanaAccount, ['solana:mainnet']),
					account(secondSolanaAccount, ['solana:devnet']),
				]
			:
				[],
		}))
		const standardWallet = wallet({ connect })
		mounted.register(standardWallet.provider)
		const connectionUpdates: WalletConnection[] = []
		const unsubscribe = mounted.adapter.subscribeConnection(
			'wallet-standard:Standard Wallet',
			(connection) => connectionUpdates.push(connection)
		)

		await vi.waitFor(() => {
			expect(connectionUpdates).toEqual([
				expect.objectContaining({
					status: BlockheadConnectionStatus.Connected,
					connectedAt: 456,
					accounts: [
						expect.objectContaining({ accountAddress: firstSolanaAccount }),
					],
				}),
			])
		})
		expect(connect).toHaveBeenCalledWith({
			silent: true,
		})

		unsubscribe()
		expect(standardWallet.listenerCount()).toBe(0)
		mounted.cleanup()
	})

	it('does not publish a late silent restore after listener cleanup', async () => {
		const restore = Promise.withResolvers<{
			accounts: StandardAccount[]
		}>()
		const mounted = mountRegistry()
		const standardWallet = wallet({
			connect: vi.fn(() => restore.promise),
		})
		mounted.register(standardWallet.provider)
		const connectionUpdates: WalletConnection[] = []
		const unsubscribe = mounted.adapter.subscribeConnection(
			'wallet-standard:Standard Wallet',
			(connection) => connectionUpdates.push(connection)
		)

		unsubscribe()
		restore.resolve({
			accounts: [account()],
		})
		await restore.promise
		await Promise.resolve()

		expect(connectionUpdates).toEqual([])
		expect(standardWallet.listenerCount()).toBe(0)
		mounted.cleanup()
	})

	it('preserves rejection and invokes advertised disconnect', async () => {
		const rejection = new Error('User rejected the request')
		const mounted = mountRegistry()
		const standardWallet = wallet({
			connect: vi.fn(async () => { throw rejection }),
		})
		mounted.register(standardWallet.provider)

		await expect(mounted.adapter.connect('wallet-standard:Standard Wallet')).rejects.toBe(rejection)
		await mounted.adapter.disconnect('wallet-standard:Standard Wallet')
		expect(standardWallet.disconnect).toHaveBeenCalledOnce()
		mounted.cleanup()
	})

	it('does not advertise or invoke malformed standard features', async () => {
		const mounted = mountRegistry()
		const malformedWallet = {
			name: 'Malformed Wallet',
			icon: '',
			accounts: [],
			features: {
				'standard:connect': {
					version: '1.0.0',
					connect: 'not callable',
				},
				'standard:events': {
					version: '1.0.0',
				},
			},
		}
		mounted.register(malformedWallet)

		expect(mounted.candidateUpdates.at(-1)?.[0]?.capabilities).toEqual([
			WalletCapability.Discover,
		])
		await expect(mounted.adapter.connect('wallet-standard:Malformed Wallet')).rejects.toThrow(
			'Malformed Wallet does not implement standard:connect 1.0.0'
		)
		mounted.cleanup()
	})

	it('leaves Aptos AIP-62 wallets for the aptosAip62 adapter', () => {
		const mounted = mountRegistry()
		mounted.register({
			name: 'Petra',
			icon: '',
			accounts: [],
			features: {
				'aptos:connect': {
					version: '1.0.0',
					connect: async () => ({
						status: 'Approved',
						args: {
							address: '0xa11ce',
						},
					}),
				},
			},
		})

		expect(mounted.candidateUpdates.at(-1)).toEqual([])
		mounted.cleanup()
	})

	it('advertises SignMessage and signs via solana:signMessage when the feature exists', async () => {
		const mounted = mountRegistry()
		const signMessage = vi.fn(async () => [{
			signature: new Uint8Array(64).fill(7),
		}])
		const standardWallet = wallet({
			includeSignMessageFeature: true,
			signMessage,
		})
		mounted.register(standardWallet.provider)

		expect(mounted.candidateUpdates.at(-1)?.[0]?.capabilities).toEqual([
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.Disconnect,
			WalletCapability.SignMessage,
		])

		const connection = await mounted.adapter.connect('wallet-standard:Standard Wallet')
		expect(connection?.accounts[0]?.capabilities).toContain(WalletCapability.SignMessage)
		expect(connection?.scopes[0]?.methods).toContain('solana:signMessage')

		await expect(mounted.adapter.signMessage?.(
			'wallet-standard:Standard Wallet',
			firstSolanaAccount,
			'Sign this private challenge',
		)).resolves.toBe(base58.encode(new Uint8Array(64).fill(7)))

		expect(signMessage).toHaveBeenCalledWith({
			account: expect.objectContaining({
				address: firstSolanaAccount,
				features: ['solana:signMessage'],
			}),
			message: new TextEncoder().encode('Sign this private challenge'),
		})
		mounted.cleanup()
	})

	it('throws when solana:signMessage is missing on the wallet', async () => {
		const mounted = mountRegistry()
		const standardWallet = wallet()
		mounted.register(standardWallet.provider)
		await mounted.adapter.connect('wallet-standard:Standard Wallet')

		await expect(mounted.adapter.signMessage?.(
			'wallet-standard:Standard Wallet',
			firstSolanaAccount,
			'hello',
		)).rejects.toThrow('Standard Wallet does not implement solana:signMessage 1.0.0')
		mounted.cleanup()
	})
})
