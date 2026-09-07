import { afterEach, describe, expect, it, vi } from 'vitest'
import { WalletCapability } from '$/constants/Wallet.ts'
import { base58 } from '@scure/base'
import { ed25519 } from '@noble/curves/ed25519.js'
import {
	createWalletStandardAdapter,
	type StandardWallet,
	type WalletRegistryApi,
} from './walletStandard.ts'
import {
	WalletAdapterPreDispatchFailure,
	WalletAdapterResponseAuditFailure,
} from './types.ts'

const privateKey = new Uint8Array([
	7, 19, 31, 43, 59, 71, 83, 97,
	109, 127, 139, 151, 163, 179, 191, 211,
	223, 229, 233, 239, 241, 251, 3, 13,
	23, 37, 47, 61, 73, 89, 101, 113,
])
const accountAddress = base58.encode(ed25519.getPublicKey(privateKey))
const publicKey = ed25519.getPublicKey(privateKey)
const siblingPrivateKey = new Uint8Array(32).fill(9)
const walletId = 'wallet-standard:Controlled Solana Wallet'
type SignMessage = NonNullable<
	NonNullable<StandardWallet['features']>['solana:signMessage']
>['signMessage']

const mountControlledWallet = (
	signMessage: SignMessage,
	accountPublicKey: Uint8Array | null = publicKey
) => {
	const eventTarget = new EventTarget()
	vi.stubGlobal('window', Object.assign(eventTarget, {
		setTimeout,
		clearTimeout,
	}))

	const signTransaction = vi.fn()
	const signAndSendTransaction = vi.fn()
	const account = {
		address: accountAddress,
		chains: ['solana:mainnet'],
		features: [
			'solana:signMessage',
			'solana:signTransaction',
			'solana:signAndSendTransaction',
		],
		...(accountPublicKey != null && { publicKey: accountPublicKey }),
	}
	const wallet = {
		name: 'Controlled Solana Wallet',
		accounts: [],
		features: {
			'standard:connect': {
				version: '1.0.0' as const,
				connect: async () => ({ accounts: [account] }),
			},
			'solana:signMessage': {
				version: '1.0.0' as const,
				signMessage,
			},
			'solana:signTransaction': { signTransaction },
			'solana:signAndSendTransaction': { signAndSendTransaction },
		},
	} satisfies StandardWallet
	const adapter = createWalletStandardAdapter()
	const cleanup = adapter.start(() => {})

	eventTarget.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
		detail: (registry: WalletRegistryApi) => registry.register(wallet),
	}))

	return {
		adapter,
		cleanup,
		signTransaction,
		signAndSendTransaction,
	}
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('controlled Solana Wallet Standard signing boundary', () => {
	it('detects signature substitution at the Wallet Standard response seam through native Ed25519 verification', async () => {
		const message = 'Blockhead controlled signing challenge: session 42, revision 3'
		const messageBytes = new TextEncoder().encode(message)
		const signMessage = vi.fn(async ({ message: requestedMessage }: { message: Uint8Array }) => [{
			signature: ed25519.sign(requestedMessage, privateKey),
		}])
		const mounted = mountControlledWallet(signMessage)

		try {
			const connection = await mounted.adapter.connect(walletId)
			expect(connection?.scopes).toEqual([{
				namespace: 'solana',
				reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				methods: ['solana:signMessage'],
				events: [],
			}])

			const encodedSignature = await mounted.adapter.signMessage?.(
				walletId,
				accountAddress,
				message
			)

			expect(encodedSignature).toBeDefined()
			expect(ed25519.verify(
				base58.decode(encodedSignature ?? ''),
				messageBytes,
				ed25519.getPublicKey(privateKey)
			)).toBe(true)
			expect(signMessage).toHaveBeenCalledOnce()
			expect(mounted.signTransaction).not.toHaveBeenCalled()
			expect(mounted.signAndSendTransaction).not.toHaveBeenCalled()
		} finally {
			mounted.cleanup()
		}
	})

	it('withholds the account sign method and rejects missing or mismatched authority before provider dispatch', async () => {
		for (const accountPublicKey of [null, siblingPrivateKey]) {
			const signMessage = vi.fn(async () => [{
				signature: ed25519.sign(new Uint8Array(), privateKey),
			}])
			const mounted = mountControlledWallet(signMessage, accountPublicKey)

			try {
				const connection = await mounted.adapter.connect(walletId)
				expect(connection?.accounts[0]?.capabilities).not.toContain(WalletCapability.SignMessage)
				expect(connection?.scopes[0]?.methods).not.toContain('solana:signMessage')
				await expect(mounted.adapter.signMessage?.(
					walletId,
					accountAddress,
					'Authority must bind before dispatch'
				)).rejects.toThrow(WalletAdapterPreDispatchFailure)
				expect(signMessage).not.toHaveBeenCalled()
			} finally {
				mounted.cleanup()
			}
		}
	})

	it('rejects zero, multiple, malformed, sibling-key, and sibling-message responses after dispatch', async () => {
		const message = 'Response must bind to this exact message'
		const cases: readonly (readonly { readonly signature: Uint8Array }[])[] = [
			[],
			[
				{ signature: ed25519.sign(new TextEncoder().encode(message), privateKey) },
				{ signature: ed25519.sign(new TextEncoder().encode(message), privateKey) },
			],
			[{ signature: new Uint8Array(63) }],
			[{ signature: ed25519.sign(new TextEncoder().encode(message), siblingPrivateKey) }],
			[{ signature: ed25519.sign(new TextEncoder().encode(`${message}!`), privateKey) }],
		]

		for (const response of cases) {
			const signMessage = vi.fn(async () => response)
			const mounted = mountControlledWallet(signMessage)

			try {
				await mounted.adapter.connect(walletId)
				await expect(mounted.adapter.signMessage?.(walletId, accountAddress, message))
					.rejects.toThrow(WalletAdapterResponseAuditFailure)
				expect(signMessage).toHaveBeenCalledOnce()
				expect(mounted.signTransaction).not.toHaveBeenCalled()
				expect(mounted.signAndSendTransaction).not.toHaveBeenCalled()
			} finally {
				mounted.cleanup()
			}
		}
	})

	it('detects rejection swallowing at the wallet approval seam through the preserved rejection and zero native effects', async () => {
		const rejection = new Error('User rejected solana:signMessage')
		const signMessage = vi.fn(async () => Promise.reject(rejection))
		const mounted = mountControlledWallet(signMessage)

		try {
			await mounted.adapter.connect(walletId)
			await expect(mounted.adapter.signMessage?.(
				walletId,
				accountAddress,
				'Do not approve this challenge'
			)).rejects.toBe(rejection)
			expect(signMessage).toHaveBeenCalledOnce()
			expect(mounted.signTransaction).not.toHaveBeenCalled()
			expect(mounted.signAndSendTransaction).not.toHaveBeenCalled()
		} finally {
			mounted.cleanup()
		}
	})
})
