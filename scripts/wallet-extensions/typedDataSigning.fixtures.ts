import { Secp256k1, Signature, TypedData } from 'ox'

export const permitAccount = '0x19e7e376e7c213b7e7e7e46cc70a5dd086daff2a'
export const permitTypedData = {
	domain: {
		name: 'Blockhead Test Token',
		version: '1',
		chainId: 1,
		verifyingContract: '0x1111111111111111111111111111111111111111',
	},
	types: {
		Permit: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' },
		],
	},
	primaryType: 'Permit',
	message: {
		owner: permitAccount,
		spender: '0x2222222222222222222222222222222222222222',
		value: '1000000000000000000',
		nonce: '7',
		deadline: '4000000000',
	},
} as const

const permitSignPayload = TypedData.getSignPayload({
	...permitTypedData,
	message: {
		...permitTypedData.message,
		value: BigInt(permitTypedData.message.value),
		nonce: BigInt(permitTypedData.message.nonce),
		deadline: BigInt(permitTypedData.message.deadline),
	},
})

export const permitSignature = Signature.toHex(Secp256k1.sign({
	privateKey: '0x1111111111111111111111111111111111111111111111111111111111111111',
	payload: permitSignPayload,
}))

export const permitOtherSignerSignature = Signature.toHex(Secp256k1.sign({
	privateKey: '0x2222222222222222222222222222222222222222222222222222222222222222',
	payload: permitSignPayload,
}))
