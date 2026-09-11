import { Secp256k1, Signature, TypedData } from 'ox'
import type { WalletAdapter, WalletTypedData } from './types.ts'
import { aggregateSafeLocalSignatures } from './safeSignatureAggregation.ts'

export type SafeLocalCall = {
	to: `0x${string}`
	value: bigint
	data: `0x${string}`
	operation?: 0 | 1
}

export type SafeLocalExecutionInput = {
	wallet: WalletAdapter
	walletId: string
	accountAddress: `0x${string}`
	chainId: number
	safeAddress: `0x${string}`
	nonce: bigint
	owners: readonly `0x${string}`[]
	threshold: number
	call: SafeLocalCall
	simulate: (input: {
		safeAddress: `0x${string}`
		call: SafeLocalCall
		nonce: bigint
	}) => Promise<void>
}

export type SafeLocalMaterialization = {
	native: {
		to: `0x${string}`
		value: bigint
		data: `0x${string}`
		operation: 0 | 1
		safeTxGas: bigint
		baseGas: bigint
		gasPrice: bigint
		gasToken: `0x${string}`
		refundReceiver: `0x${string}`
		nonce: bigint
		signatures: `0x${string}`
	}
	safeTxHash: `0x${string}`
	owner: `0x${string}`
}

const zeroAddress = '0x0000000000000000000000000000000000000000' as const

const safeTypedData = (input: Readonly<{
	chainId: number
	safeAddress: `0x${string}`
	nonce: bigint
	call: SafeLocalCall
}>): WalletTypedData => ({
	types: {
		SafeTx: [
			{ name: 'to', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'data', type: 'bytes' },
			{ name: 'operation', type: 'uint8' },
			{ name: 'safeTxGas', type: 'uint256' },
			{ name: 'baseGas', type: 'uint256' },
			{ name: 'gasPrice', type: 'uint256' },
			{ name: 'gasToken', type: 'address' },
			{ name: 'refundReceiver', type: 'address' },
			{ name: 'nonce', type: 'uint256' },
		],
	},
	primaryType: 'SafeTx',
	domain: { chainId: input.chainId, verifyingContract: input.safeAddress },
	message: {
		to: input.call.to,
		value: input.call.value.toString(),
		data: input.call.data,
		operation: input.call.operation ?? 0,
		safeTxGas: '0',
		baseGas: '0',
		gasPrice: '0',
		gasToken: zeroAddress,
		refundReceiver: zeroAddress,
		nonce: input.nonce.toString(),
	},
})

export const materializeSafeLocalExecution = async (
	input: SafeLocalExecutionInput
): Promise<SafeLocalMaterialization> => {
	const selectedWallet = input.wallet
	const selectedWalletId = input.walletId
	const signTypedData = selectedWallet.signTypedData
	const intent = Object.freeze({
		accountAddress: input.accountAddress,
		chainId: input.chainId,
		safeAddress: input.safeAddress,
		nonce: input.nonce,
		owners: Object.freeze([...input.owners]),
		threshold: input.threshold,
		call: Object.freeze({
			to: input.call.to,
			value: input.call.value,
			data: input.call.data,
			operation: input.call.operation ?? 0,
		}),
	})
	if (!Number.isSafeInteger(intent.threshold) || intent.threshold < 1 || intent.threshold > intent.owners.length)
		throw new Error('Safe threshold must be a safe integer between one and the owner count')
	if (intent.owners.length !== new Set(intent.owners.map((owner) => owner.toLowerCase())).size)
		throw new Error('Safe owners must be unique')
	if (intent.threshold > 1)
		throw new Error('Safe thresholds above one require distinct wallet authorities and are not supported')
	if (!intent.owners.some((owner) => owner.toLowerCase() === intent.accountAddress.toLowerCase()))
		throw new Error('Connected wallet account is not a declared Safe owner')
	if (signTypedData == null)
		throw new Error('Connected wallet does not expose Safe typed-data signing')

	const typedData = safeTypedData(intent)
	const safeTxHash = TypedData.getSignPayload(typedData)
	await input.simulate({
		safeAddress: intent.safeAddress,
		call: intent.call,
		nonce: intent.nonce,
	})
	const signature = await signTypedData.call(
		selectedWallet,
		selectedWalletId,
		intent.accountAddress,
		typedData
	)
	const parsedSignature = Signature.fromHex(`0x${signature.replace(/^0x/, '')}`)
	const signer = Secp256k1.recoverAddress({ payload: safeTxHash, signature: parsedSignature })
	if (signer.toLowerCase() !== intent.accountAddress.toLowerCase())
		throw new Error('Safe signature was not produced by the requested wallet account')
	const signatures = aggregateSafeLocalSignatures({
		payload: safeTxHash,
		owners: intent.owners,
		threshold: intent.threshold,
		signatures: [Signature.toHex(parsedSignature)],
	})
	return {
		native: {
			...intent.call,
			safeTxGas: 0n,
			baseGas: 0n,
			gasPrice: 0n,
			gasToken: zeroAddress,
			refundReceiver: zeroAddress,
			nonce: intent.nonce,
			signatures,
		},
		safeTxHash,
		owner: intent.accountAddress,
	}
}
