import { Address, Secp256k1, Signature, TypedData } from 'ox'
import { describe, expect, it, vi } from 'vitest'
import type { WalletAdapter, WalletTypedData } from './types.ts'
import { materializeSafeLocalExecution } from './safeSmartAccountLocalExecution.ts'

const key = '0x0000000000000000000000000000000000000000000000000000000000000001' as const
const otherKey = '0x0000000000000000000000000000000000000000000000000000000000000002' as const
const account = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey: key }))
const otherAccount = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey: otherKey }))
const call = { to: '0x3333333333333333333333333333333333333333' as const, value: 1n, data: '0xa9059cbb' as const }

const wallet = (signer: `0x${string}`): WalletAdapter & { signTypedData: ReturnType<typeof vi.fn> } => ({
	id: 'safe-fixture',
	start: () => () => {},
	connect: async () => undefined,
	signTypedData: vi.fn(async function (this: WalletAdapter, _walletId: string, _accountAddress: string, data: WalletTypedData) {
		return Signature.toHex(Secp256k1.sign({
		payload: TypedData.getSignPayload(data),
		privateKey: signer,
		}))
	}),
	disconnect: () => {},
	subscribeConnection: () => () => {},
})

describe('Safe local materialization', () => {
	it('materializes a single-owner signature from frozen intent', async () => {
		const signingWallet = wallet(key)
		const result = await materializeSafeLocalExecution({
			wallet: signingWallet,
			walletId: 'safe-fixture',
			accountAddress: account,
			chainId: 1,
			safeAddress: '0x4444444444444444444444444444444444444444',
			nonce: 1n,
			owners: [account],
			threshold: 1,
			call,
			simulate: async () => {},
		})
		expect(result.native.nonce).toBe(1n)
		expect(result.owner).toBe(account)
		const signedData = signingWallet.signTypedData.mock.calls[0][2]
		expect(signedData.domain).toEqual({
			chainId: 1,
			verifyingContract: '0x4444444444444444444444444444444444444444',
		})
		expect(signedData.primaryType).toBe('SafeTx')
		expect(signedData.message).toEqual({
			to: call.to,
			value: '1',
			data: call.data,
			operation: 0,
			safeTxGas: '0',
			baseGas: '0',
			gasPrice: '0',
			gasToken: '0x0000000000000000000000000000000000000000',
			refundReceiver: '0x0000000000000000000000000000000000000000',
			nonce: '1',
		})
		expect(result.safeTxHash).toBe(TypedData.getSignPayload(signedData))
		expect(result.native.signatures).toBe(Signature.toHex(Secp256k1.sign({
			payload: result.safeTxHash,
			privateKey: key,
		})))
	})

	it('rejects NaN, fractional thresholds, and a wrong selected signer', async () => {
		const signingWallet = wallet(key)
		const base = {
			wallet: signingWallet,
			walletId: 'safe-fixture',
			accountAddress: account,
			chainId: 1,
			safeAddress: '0x4444444444444444444444444444444444444444' as const,
			nonce: 1n,
			owners: [account, otherAccount] as const,
			call,
			simulate: async () => {},
		}
		await expect(materializeSafeLocalExecution({ ...base, threshold: Number.NaN })).rejects.toThrow('safe integer')
		await expect(materializeSafeLocalExecution({ ...base, threshold: 1.5 })).rejects.toThrow('safe integer')
		await expect(materializeSafeLocalExecution({ ...base, owners: [account], threshold: 1, wallet: wallet(otherKey) })).rejects.toThrow('requested wallet account')
	})

	it('returns frozen call and nonce despite mutation during simulation', async () => {
		const mutableCall = { ...call }
		const input = {
			wallet: wallet(key),
			walletId: 'safe-fixture',
			accountAddress: account,
			chainId: 1,
			safeAddress: '0x4444444444444444444444444444444444444444' as const,
			nonce: 1n,
			owners: [account] as const,
			threshold: 1,
			call: mutableCall,
			simulate: async () => {
				mutableCall.value = 9n
				input.nonce = 9n
			},
		}
		const result = await materializeSafeLocalExecution(input)
		expect(result.native.value).toBe(1n)
		expect(result.native.nonce).toBe(1n)
		expect(input.nonce).toBe(9n)
	})

	it('invokes the originally selected wallet, id, and receiver after simulation swaps them', async () => {
		const selected = wallet(key)
		const originalSignTypedData = selected.signTypedData
		const replacement = wallet(otherKey)
		const input = {
			wallet: selected,
			walletId: 'selected-wallet',
			accountAddress: account,
			chainId: 1,
			safeAddress: '0x4444444444444444444444444444444444444444' as const,
			nonce: 1n,
			owners: [account] as const,
			threshold: 1,
			call,
			simulate: async () => {
				input.wallet = replacement
				input.walletId = 'replacement-wallet'
				selected.signTypedData = vi.fn(async () => '0x' + '22'.repeat(65))
			},
		}
		const result = await materializeSafeLocalExecution(input)
		expect(result.owner).toBe(account)
		expect(originalSignTypedData).toHaveBeenCalledWith('selected-wallet', account, expect.any(Object))
		expect(originalSignTypedData.mock.contexts[0]).toBe(selected)
		expect(selected.signTypedData).not.toHaveBeenCalled()
		expect(replacement.signTypedData).not.toHaveBeenCalled()
	})
})
