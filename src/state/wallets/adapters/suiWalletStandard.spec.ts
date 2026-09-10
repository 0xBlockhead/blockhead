import { afterEach, describe, expect, it, vi } from 'vitest'
import { WalletCapability } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { createSuiWalletStandardAdapter } from './suiWalletStandard.ts'
import type { StandardWallet, WalletRegistryApi } from '$/state/wallets/adapters/walletStandard.ts'
import type { WalletCandidate } from '$/state/wallets/adapters/types.ts'
import { WalletAdapterResponseAuditFailure } from '$/state/wallets/adapters/types.ts'

const walletId = 'wallet-standard-sui:Controlled Sui Wallet'
const validAddress = `0x${'12'.repeat(32)}`
const validAccount = {
	address: validAddress,
	chains: ['sui:mainnet'],
	features: ['sui:signPersonalMessage'],
}

type SignPersonalMessage = NonNullable<
	NonNullable<StandardWallet['features']>['sui:signPersonalMessage']
>['signPersonalMessage']
type Connect = NonNullable<
	NonNullable<StandardWallet['features']>['standard:connect']
>['connect']

const toBase64 = (bytes: Uint8Array) => (
	globalThis.btoa(String.fromCharCode(...bytes))
)

const message = 'Blockhead controlled Sui signing challenge: session 42, revision 3'
const messageBytes = new TextEncoder().encode(message)
const validResponse = {
	bytes: toBase64(messageBytes),
	signature: toBase64(new Uint8Array([1, 2, 3])),
} satisfies JsonValue

const createWallet = ({
	account = validAccount,
	connect = vi.fn(async () => ({ accounts: [account] })),
	signPersonalMessage = vi.fn(async (_input: Parameters<SignPersonalMessage>[0]) => validResponse),
	includeSignFeature = true,
	includeTransactions = false,
}: {
	account?: typeof validAccount
	connect?: Connect
	signPersonalMessage?: SignPersonalMessage
	includeSignFeature?: boolean
	includeTransactions?: boolean
} = {}) => {
	const changeListeners = new Set<(properties: { accounts?: typeof validAccount[] }) => void>()
	const signTransaction = vi.fn()
	const signAndExecuteTransaction = vi.fn()
	const provider: StandardWallet = {
		name: 'Controlled Sui Wallet',
		accounts: [],
		features: {
			'standard:connect': {
				version: '1.0.0',
				connect,
			},
			'standard:events': {
				version: '1.0.0',
				on: (_event, listener) => {
					changeListeners.add(listener)
					return () => changeListeners.delete(listener)
				},
			},
			...(includeSignFeature && {
				'sui:signPersonalMessage': {
					version: '1.1.0',
					signPersonalMessage,
				},
			}),
			...(includeTransactions && {
				'sui:signTransaction': { signTransaction },
				'sui:signAndExecuteTransaction': { signAndExecuteTransaction },
			}),
		},
	}

	return {
		provider,
		connect,
		signPersonalMessage,
		signTransaction,
		signAndExecuteTransaction,
		emitAccounts: (accounts: typeof validAccount[]) => {
			for (const listener of changeListeners) listener({ accounts })
		},
	}
}

const mountRegistry = (
	wallet = createWallet(),
	eventTarget = new EventTarget()
) => {
	vi.stubGlobal('window', Object.assign(eventTarget, {
		setTimeout,
		clearTimeout,
	}))
	const adapter = createSuiWalletStandardAdapter()
	const candidateUpdates: WalletCandidate[][] = []
	const cleanup = adapter.start((candidates) => candidateUpdates.push(candidates))
	let registrationCleanup = () => {}
	eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
		detail: (registry: WalletRegistryApi) => {
			registrationCleanup = registry.register(wallet.provider)
		},
	}))

	return {
		adapter,
		cleanup,
		registrationCleanup,
		candidateUpdates,
		eventTarget,
		wallet,
	}
}

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

describe('controlled Sui Wallet Standard signing boundary', () => {
	it('does not publish a delayed connect after local disconnect', async () => {
		const pending = Promise.withResolvers<{ accounts: typeof validAccount[] }>()
		const mounted = mountRegistry(createWallet({ connect: vi.fn(() => pending.promise) }))
		const connect = mounted.adapter.connect(walletId)
		const disconnect = mounted.adapter.disconnect(walletId)
		pending.resolve({ accounts: [validAccount] })
		await disconnect
		expect(await connect).toBeUndefined()
		mounted.cleanup()
	})
	it('accepts only a canonical Sui mainnet account and exposes only the advertised message capability', async () => {
		const mounted = mountRegistry(createWallet({
			account: validAccount,
		}))
		const invalidWallet = createWallet({
			account: {
				address: '0x12',
				chains: ['sui:devnet'],
				features: [],
			},
		})

		try {
			expect(mounted.candidateUpdates.at(-1)).toEqual([expect.objectContaining({
				id: walletId,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
				],
			})])

			const connection = await mounted.adapter.connect(walletId)
			expect(connection).toEqual(expect.objectContaining({
				status: BlockheadConnectionStatus.Connected,
				scopes: [{
					namespace: 'sui',
					reference: 'mainnet',
					methods: ['sui:signPersonalMessage'],
					events: ['change'],
				}],
				accounts: [{
					namespace: 'sui',
					reference: 'mainnet',
					accountAddress: validAddress,
					capabilities: [
						WalletCapability.Discover,
						WalletCapability.Connect,
						WalletCapability.Reconnect,
						WalletCapability.ListAccounts,
						WalletCapability.WatchAccounts,
						WalletCapability.SignMessage,
					],
				}],
			}))
			expect(connection?.accounts[0]?.capabilities.filter((capability) => (
				capability === WalletCapability.SignMessage
			))).toHaveLength(1)

			const noAccountAuthority = mountRegistry(createWallet({
				account: {
					...validAccount,
					features: [],
				},
			}))
			try {
				const connectionWithoutAccountAuthority = await noAccountAuthority.adapter.connect(walletId)
				expect(connectionWithoutAccountAuthority?.accounts[0]?.capabilities).not.toContain(
					WalletCapability.SignMessage
				)
				expect(connectionWithoutAccountAuthority?.scopes[0]?.methods).toEqual([])
			} finally {
				noAccountAuthority.cleanup()
			}

			const noProviderMethod = mountRegistry(createWallet({
				includeSignFeature: false,
			}))
			try {
				expect(noProviderMethod.candidateUpdates.at(-1)).toEqual([])
				expect(await noProviderMethod.adapter.connect(walletId)).toBeUndefined()
			} finally {
				noProviderMethod.cleanup()
			}

			const invalidMounted = mountRegistry(invalidWallet)
			await expect(invalidMounted.adapter.connect(walletId)).rejects.toThrow(
				'did not authorize a valid Sui mainnet account'
			)
			invalidMounted.cleanup()
		} finally {
			mounted.cleanup()
		}
	})

	it('sends the exact Sui personal-message request and audits the base64 response', async () => {
		let request: Parameters<SignPersonalMessage>[0] | undefined
		const signPersonalMessage = vi.fn(async (input: Parameters<SignPersonalMessage>[0]) => {
			request = input
			return validResponse
		})
		const mounted = mountRegistry(createWallet({ signPersonalMessage }))

		try {
			await mounted.adapter.connect(walletId)
			await expect(mounted.adapter.signMessage?.(walletId, validAddress, message)).resolves.toBe(
				validResponse.signature
			)
			expect(request).toEqual({
				account: validAccount,
				chain: 'sui:mainnet',
				message: messageBytes,
			})
			expect(signPersonalMessage.mock.contexts[0]).toBe(
				mounted.wallet.provider.features?.['sui:signPersonalMessage']
			)
			expect(request?.account).not.toBe(validAccount)
			expect(request?.account.chains).not.toBe(validAccount.chains)
			expect(request?.account.features).not.toBe(validAccount.features)
			expect(signPersonalMessage).toHaveBeenCalledOnce()
		} finally {
			mounted.cleanup()
		}
	})

	it.each([
		['wrong signed bytes', { bytes: toBase64(new Uint8Array([9])), signature: validResponse.signature }],
		['invalid signature encoding', { bytes: validResponse.bytes, signature: 'not base64' }],
		['empty signature', { bytes: validResponse.bytes, signature: '' }],
	])('rejects %s as a response-audit failure', async (_label, response) => {
		const mounted = mountRegistry(createWallet({
			signPersonalMessage: vi.fn(async () => response),
		}))

		try {
			await mounted.adapter.connect(walletId)
			await expect(mounted.adapter.signMessage?.(walletId, validAddress, message)).rejects.toBeInstanceOf(
				WalletAdapterResponseAuditFailure
			)
		} finally {
			mounted.cleanup()
		}
	})

	it('preserves provider rejection identity without converting it to refusal or success', async () => {
		const rejection = new Error('Sui user rejected the personal-message request')
		const mounted = mountRegistry(createWallet({
			signPersonalMessage: vi.fn(async () => { throw rejection }),
		}))

		try {
			await mounted.adapter.connect(walletId)
			await expect(mounted.adapter.signMessage?.(walletId, validAddress, message)).rejects.toBe(rejection)
		} finally {
			mounted.cleanup()
		}
	})

	it('retains input and response snapshots across provider awaits', async () => {
		const release = Promise.withResolvers<void>()
		let observedMessageAtDispatch: Uint8Array | undefined
		const response = { ...validResponse }
		const signPersonalMessage = vi.fn(async (input: Parameters<SignPersonalMessage>[0]) => {
			observedMessageAtDispatch = input.message.slice()
			await release.promise
			input.message.fill(255)
			return response
		})
		const mounted = mountRegistry(createWallet({ signPersonalMessage }))

		try {
			await mounted.adapter.connect(walletId)
			const result = mounted.adapter.signMessage?.(walletId, validAddress, message)
			await vi.waitFor(() => expect(observedMessageAtDispatch).toEqual(messageBytes))
			release.resolve()
			await expect(result).resolves.toBe(validResponse.signature)
			response.signature = 'mutated-after-return'
			expect(await result).toBe(validResponse.signature)
		} finally {
			mounted.cleanup()
		}
	})

	it('restarts registration safely for the same wallet without duplicate listeners', async () => {
		const eventTarget = new EventTarget()
		const addEventListener = vi.spyOn(eventTarget, 'addEventListener')
		const removeEventListener = vi.spyOn(eventTarget, 'removeEventListener')
		const mounted = mountRegistry(createWallet(), eventTarget)
		let staleRegisterWallet = (_wallet: StandardWallet) => {}
		mounted.eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
			detail: {
				register: (registerWallet: (wallet: StandardWallet) => void) => {
					staleRegisterWallet = registerWallet
				},
			},
		}))
		mounted.cleanup()

		const restartedCandidates: WalletCandidate[][] = []
		const restartCleanup = mounted.adapter.start((candidates) => restartedCandidates.push(candidates))
		try {
			staleRegisterWallet(mounted.wallet.provider)
			expect(restartedCandidates.at(-1)).toEqual([])

			let registerAgain = (_wallet: StandardWallet) => () => {}
			let firstRegistrationCleanup = () => {}
			let duplicateRegistrationCleanup = () => {}
			mounted.eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
				detail: (registry: WalletRegistryApi) => {
					registerAgain = (wallet) => registry.register(wallet)
					firstRegistrationCleanup = registry.register(mounted.wallet.provider)
					duplicateRegistrationCleanup = registry.register(mounted.wallet.provider)
				},
			}))
			duplicateRegistrationCleanup()
			mounted.registrationCleanup()
			mounted.cleanup()

			expect(restartedCandidates.filter((candidates) => candidates.length)).toHaveLength(1)
			expect(restartedCandidates.at(-1)).toEqual([expect.objectContaining({ id: walletId })])

			firstRegistrationCleanup()
			expect(restartedCandidates.at(-1)).toEqual([])
			const secondRegistrationCleanup = registerAgain(mounted.wallet.provider)
			firstRegistrationCleanup()
			expect(restartedCandidates.at(-1)).toEqual([expect.objectContaining({ id: walletId })])

			const connection = await mounted.adapter.connect(walletId)
			expect(connection?.accounts[0]?.accountAddress).toBe(validAddress)
			await expect(mounted.adapter.signMessage?.(walletId, validAddress, message)).resolves.toBe(
				validResponse.signature
			)
			expect(mounted.wallet.signPersonalMessage).toHaveBeenCalledOnce()
			secondRegistrationCleanup()
			expect(restartedCandidates.at(-1)).toEqual([])
		} finally {
			restartCleanup()
		}

		expect(addEventListener).toHaveBeenCalledTimes(2)
		expect(removeEventListener).toHaveBeenCalledTimes(2)
	})

	it('drops a pending connect completion after stop and same-wallet restart', async () => {
		const releaseConnect = Promise.withResolvers<{
			readonly accounts: readonly typeof validAccount[]
		}>()
		const wallet = createWallet({
			connect: vi.fn(() => releaseConnect.promise),
		})
		const mounted = mountRegistry(wallet)
		const pendingConnection = mounted.adapter.connect(walletId)
		await vi.waitFor(() => expect(wallet.connect).toHaveBeenCalledOnce())
		mounted.cleanup()

		const restartCleanup = mounted.adapter.start(() => {})
		try {
			mounted.eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
				detail: (registry: WalletRegistryApi) => registry.register(wallet.provider),
			}))
			releaseConnect.resolve({ accounts: [validAccount] })

			await expect(pendingConnection).resolves.toBeUndefined()
			await expect(mounted.adapter.signMessage?.(walletId, validAddress, message)).rejects.toThrow(
				'is not connected with Sui account'
			)
		} finally {
			restartCleanup()
		}
	})

	it('fences a subscribed account event callback after stop and same-wallet restart', async () => {
		const mounted = mountRegistry()
		await mounted.adapter.connect(walletId)
		const updateConnection = vi.fn()
		const subscriptionCleanup = mounted.adapter.subscribeConnection(walletId, updateConnection)
		mounted.cleanup()

		const restartCleanup = mounted.adapter.start(() => {})
		try {
			mounted.eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
				detail: (registry: WalletRegistryApi) => registry.register(mounted.wallet.provider),
			}))
			mounted.wallet.emitAccounts([validAccount])

			expect(updateConnection).not.toHaveBeenCalled()
			await expect(mounted.adapter.signMessage?.(walletId, validAddress, message)).rejects.toThrow(
				'is not connected with Sui account'
			)
		} finally {
			subscriptionCleanup()
			restartCleanup()
		}
	})

	it('does not advertise or invoke Sui transaction or broadcast features', async () => {
		const mounted = mountRegistry(createWallet({ includeTransactions: true }))

		try {
			const connection = await mounted.adapter.connect(walletId)
			expect(connection?.accounts[0]?.capabilities).not.toContain(WalletCapability.SignTransaction)
			expect(connection?.accounts[0]?.capabilities).not.toContain(WalletCapability.SendTransaction)
			expect(connection?.scopes[0]?.methods).toEqual(['sui:signPersonalMessage'])
			expect(mounted.wallet.signTransaction).not.toHaveBeenCalled()
			expect(mounted.wallet.signAndExecuteTransaction).not.toHaveBeenCalled()
		} finally {
			mounted.cleanup()
		}
	})
})
