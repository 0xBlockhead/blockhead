import * as AbiFunction from 'ox/AbiFunction'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as TypedData from 'ox/TypedData'
import { type } from 'arktype'

import {
	actionAuthorityRequestEnvelopeHash,
	type ActionAuthorityRequestEnvelope,
} from '$/actions/execution.ts'
import {
	erc1271MagicValue,
	evmErc1271ChainId,
	evmErc1271SignatureValidation,
	type EvmErc1271SignatureValidation,
} from '$/schema/EvmErc1271SignatureValidationEvidence.ts'
import { UrlString } from '$/schema/UrlString.ts'
import {
	EvmAddress,
	EvmRpcQuantity,
	Hash32,
	ZeroExHex,
} from '$/schema/ZeroExHex.ts'
import type { WalletTypedData } from '$/state/wallets/adapters/types.ts'


const isValidSignature = AbiFunction.from(
	'function isValidSignature(bytes32 hash, bytes signature) view returns (bytes4 magicValue)'
)
const signatureBytes = ZeroExHex.narrow((value) => (
	value.length > 2
	&& value.length % 2 === 0
))
const nonnegativeTimestamp = type('number.integer >= 0')
const nonemptyString = type('string > 0')

export type EvmErc1271CallTransport = {
	origin: string
	getCall(request: {
		chainId: number
		to: typeof EvmAddress.infer
		input: typeof ZeroExHex.infer
		blockTag: typeof EvmRpcQuantity.infer
	}): Promise<string>
}

const sha256Text = (value: string) => Hash32.assert(
	Hash.sha256(Hex.fromString(value))
)

const typedDataScalar = type('string | number | boolean')
const typedDataParameter = type({
	name: 'string',
	type: 'string',
}).onUndeclaredKey('reject')
const walletTypedData = type({
	types: {
		'[string]': typedDataParameter.array(),
	},
	primaryType: 'string > 0',
	domain: {
		'[string]': typedDataScalar,
	},
	message: {
		'[string]': type.or(typedDataScalar, {
			'[string]': typedDataScalar,
		}),
	},
}).onUndeclaredKey('reject')
const encodedChainId = type('string').narrow((value) => (
	/^[1-9][0-9]*$/.test(value) || /^0x[1-9a-f][0-9a-f]*$/i.test(value)
))

const parseWalletTypedData = (value: string): WalletTypedData => {
	let parsed: WalletTypedData
	try {
		parsed = walletTypedData.assert(JSON.parse(value))
	}
	catch (cause) {
		throw new Error('ERC-1271 typed data does not match the wallet typed-data contract.', {
			cause,
		})
	}
	return parsed
}

const typedDataChainId = (typedData: WalletTypedData) => {
	const value = typedData.domain.chainId
	if (evmErc1271ChainId.allows(value)) return value
	if (encodedChainId.allows(value)) {
		const parsed = Number(BigInt(value))
		if (Number.isSafeInteger(parsed)) return parsed
	}
	throw new Error('ERC-1271 typed data requires a positive, safe domain chainId.')
}

const authorityRequestDigest = (authorityEnvelope: ActionAuthorityRequestEnvelope) => {
	if (authorityEnvelope.adapterKey === 'evm.personal-sign')
		return Hash32.assert(PersonalMessage.getSignPayload(
			Hex.fromString(authorityEnvelope.value.message)
		))
	if (authorityEnvelope.adapterKey !== 'evm.typed-data')
		throw new Error('ERC-1271 evaluation requires an EVM signing authority envelope.')
	const typedData = parseWalletTypedData(authorityEnvelope.value.typedDataJson)
	if (typedDataChainId(typedData) !== authorityEnvelope.value.chainId)
		throw new Error('ERC-1271 typed-data chain does not match its authority envelope.')
	try {
		return Hash32.assert(TypedData.getSignPayload(typedData))
	}
	catch (cause) {
		throw new Error('ERC-1271 typed data is not EIP-712 encodable.', { cause })
	}
}

export const evaluateEvmErc1271Signature = async ({
	authorityEnvelope,
	authorityRequestId,
	blockTag,
	dispatchOccurrenceId,
	evaluatedAt,
	signature,
	signatureHash,
	transport,
}: {
	authorityEnvelope: ActionAuthorityRequestEnvelope
	authorityRequestId: string
	blockTag: string
	dispatchOccurrenceId: string
	evaluatedAt: number
	signature: string
	signatureHash: string
	transport: EvmErc1271CallTransport
}): Promise<EvmErc1271SignatureValidation> => {
	if (
		authorityEnvelope.adapterKey !== 'evm.personal-sign'
		&& authorityEnvelope.adapterKey !== 'evm.typed-data'
	)
		throw new Error('ERC-1271 evaluation requires an EVM signing authority envelope.')
	const normalizedAccountAddress = EvmAddress.assert(
		authorityEnvelope.value.accountAddress.toLowerCase()
	)
	const normalizedChainId = evmErc1271ChainId.assert(authorityEnvelope.value.chainId)
	const normalizedRequestDigest = authorityRequestDigest(authorityEnvelope)
	const normalizedBlockTag = EvmRpcQuantity.assert(blockTag)
	const normalizedDispatchOccurrenceId = nonemptyString.assert(dispatchOccurrenceId)
	const normalizedAuthorityRequestId = nonemptyString.assert(authorityRequestId)
	const normalizedEvaluatedAt = nonnegativeTimestamp.assert(evaluatedAt)
	const normalizedSignature = signatureBytes.assert(signature)
	const normalizedSignatureHash = Hash32.assert(signatureHash)
	if (sha256Text(normalizedSignature) !== normalizedSignatureHash)
		throw new Error('ERC-1271 signature bytes do not match the dispatch signature hash.')

	const rpcOrigin = UrlString.assert(transport.origin)
	const callData = AbiFunction.encodeData(isValidSignature, [
		normalizedRequestDigest,
		normalizedSignature,
	])
	const common = {
		standard: 'ERC-1271',
		dispatchOccurrenceId: normalizedDispatchOccurrenceId,
		authorityRequestId: normalizedAuthorityRequestId,
		authorityEnvelopeHash: actionAuthorityRequestEnvelopeHash(authorityEnvelope),
		chainId: normalizedChainId,
		accountAddress: normalizedAccountAddress,
		requestDigest: normalizedRequestDigest,
		signatureHash: normalizedSignatureHash,
		rpcOrigin,
		blockTag: normalizedBlockTag,
		callDataHash: Hash32.assert(Hash.sha256(callData)),
		evaluatedAt: normalizedEvaluatedAt,
		coverage: 'isValidSignature(bytes32,bytes)-eth_call-only',
	} as const

	let output: string
	try {
		output = await transport.getCall({
			chainId: normalizedChainId,
			to: normalizedAccountAddress,
			input: callData,
			blockTag: normalizedBlockTag,
		})
	}
	catch (cause) {
		return evmErc1271SignatureValidation.assert({
			...common,
			result: {
				kind: 'call-failed',
				error: cause instanceof Error ? cause.message : String(cause),
			},
		})
	}

	const outputHash = sha256Text(output)
	try {
		const magicValue = AbiFunction.decodeResult(
			isValidSignature,
			ZeroExHex.assert(output)
		).toLowerCase()
		return evmErc1271SignatureValidation.assert({
			...common,
			result: magicValue === erc1271MagicValue ? {
				kind: 'valid',
				magicValue,
				outputHash,
			} : {
				kind: 'invalid',
				magicValue,
				outputHash,
			},
		})
	}
	catch (cause) {
		return evmErc1271SignatureValidation.assert({
			...common,
			result: {
				kind: 'malformed-return',
				outputHash,
				error: cause instanceof Error ? cause.message : String(cause),
			},
		})
	}
}
