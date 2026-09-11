import { describe, expect, it, vi } from 'vitest'
import * as AbiFunction from 'ox/AbiFunction'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as TypedData from 'ox/TypedData'

import type { ActionAuthorityRequestEnvelope } from './execution.ts'
import { evaluateEvmErc1271Signature } from './evmErc1271SignatureValidation.ts'
import type { WalletTypedData } from '../state/wallets/adapters/types.ts'


const isValidSignature = AbiFunction.from(
	'function isValidSignature(bytes32 hash, bytes signature) view returns (bytes4 magicValue)'
)
const accountAddress = '0x2222222222222222222222222222222222222222'
const otherAccountAddress = '0x7777777777777777777777777777777777777777'
const signature: `0x${string}` = `0x${'44'.repeat(96)}`
const signatureHash = Hash.sha256(Hex.fromString(signature))
const eip712Digest = (value: WalletTypedData) => TypedData.getSignPayload(value)
const typedData = {
	types: {
		EIP712Domain: [
			{ name: 'name', type: 'string' },
			{ name: 'version', type: 'string' },
			{ name: 'chainId', type: 'uint256' },
			{ name: 'verifyingContract', type: 'address' },
		],
		Permit: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
		],
	},
	primaryType: 'Permit',
	domain: {
		name: 'Token',
		version: '1',
		chainId: 1,
		verifyingContract: '0x5555555555555555555555555555555555555555',
	},
	message: {
		owner: accountAddress,
		spender: '0x6666666666666666666666666666666666666666',
		value: 7,
	},
} as const satisfies WalletTypedData
const authorityEnvelope = {
	adapterKey: 'evm.typed-data',
	adapterVersion: '1',
	value: {
		chainId: 1,
		accountAddress,
		typedDataJson: JSON.stringify(typedData),
	},
} as const satisfies ActionAuthorityRequestEnvelope

const evaluate = (
	getCall: (request: object) => Promise<string>,
	envelope: ActionAuthorityRequestEnvelope = authorityEnvelope
) => evaluateEvmErc1271Signature({
	authorityEnvelope: envelope,
	authorityRequestId: 'authority-request-1',
	blockTag: '0x2a',
	dispatchOccurrenceId: 'dispatch-occurrence-1',
	evaluatedAt: 1_700_000_000_000,
	signature,
	signatureHash,
	transport: {
		origin: 'http://127.0.0.1:8545',
		getCall,
	},
})

describe('native ERC-1271 signature validation', () => {
	it('derives the EIP-712 digest and account exclusively from the authority envelope', async () => {
		const requestDigest = eip712Digest(typedData)
		const getCall = vi.fn(async () => AbiFunction.encodeResult(
			isValidSignature,
			'0x1626ba7e'
		))
		const validation = await evaluate(getCall)

		expect(validation).toMatchObject({
			chainId: 1,
			accountAddress,
			requestDigest,
			result: { kind: 'valid', magicValue: '0x1626ba7e' },
		})
		expect(getCall).toHaveBeenCalledOnce()
		expect(getCall).toHaveBeenCalledWith({
			chainId: 1,
			to: accountAddress,
			input: AbiFunction.encodeData(isValidSignature, [requestDigest, signature]),
			blockTag: '0x2a',
		})
	})

	it('derives the ERC-191 personal_sign digest from the exact persisted message', async () => {
		const envelope = {
			adapterKey: 'evm.personal-sign',
			adapterVersion: '1',
			value: { chainId: 1, accountAddress, message: 'approve action 41' },
		} as const satisfies ActionAuthorityRequestEnvelope
		const requestDigest = PersonalMessage.getSignPayload(Hex.fromString(envelope.value.message))
		const getCall = vi.fn(async () => AbiFunction.encodeResult(
			isValidSignature,
			'0x1626ba7e'
		))

		await evaluate(getCall, envelope)

		expect(getCall).toHaveBeenCalledWith(expect.objectContaining({
			input: AbiFunction.encodeData(isValidSignature, [requestDigest, signature]),
		}))
	})

	it('changes the call digest when the persisted typed-data message is substituted', async () => {
		const substituted = {
			...typedData,
			message: { ...typedData.message, value: 8 },
		} satisfies WalletTypedData
		const envelope = {
			...authorityEnvelope,
			value: {
				...authorityEnvelope.value,
				typedDataJson: JSON.stringify(substituted),
			},
		} satisfies ActionAuthorityRequestEnvelope
		const getCall = vi.fn(async () => AbiFunction.encodeResult(
			isValidSignature,
			'0x1626ba7e'
		))

		const validation = await evaluate(getCall, envelope)

		expect(validation.requestDigest).toBe(eip712Digest(substituted))
		expect(validation.requestDigest).not.toBe(eip712Digest(typedData))
	})

	it('uses a substituted envelope account as the RPC target, with no caller override', async () => {
		const envelope = {
			...authorityEnvelope,
			value: { ...authorityEnvelope.value, accountAddress: otherAccountAddress },
		} satisfies ActionAuthorityRequestEnvelope
		const getCall = vi.fn(async () => AbiFunction.encodeResult(
			isValidSignature,
			'0x1626ba7e'
		))

		await evaluate(getCall, envelope)

		expect(getCall).toHaveBeenCalledWith(expect.objectContaining({ to: otherAccountAddress }))
	})

	it.each([
		{
			label: 'malformed JSON',
			typedDataJson: '{',
			error: 'wallet typed-data contract',
		},
		{
			label: 'an incomplete typed-data shape',
			typedDataJson: JSON.stringify({ primaryType: 'Permit' }),
			error: 'wallet typed-data contract',
		},
		{
			label: 'a chain inconsistent with the authority envelope',
			typedDataJson: JSON.stringify({
				...typedData,
				domain: { ...typedData.domain, chainId: 10 },
			}),
			error: 'chain does not match its authority envelope',
		},
		{
			label: 'semantically invalid EIP-712 data',
			typedDataJson: JSON.stringify({
				...typedData,
				message: { ...typedData.message, owner: 'not-an-address' },
			}),
			error: 'not EIP-712 encodable',
		},
	] as const)('rejects $label before RPC', async ({ typedDataJson, error }) => {
		const getCall = vi.fn(async () => '0x')
		await expect(evaluate(getCall, {
			...authorityEnvelope,
			value: { ...authorityEnvelope.value, typedDataJson },
		})).rejects.toThrow(error)
		expect(getCall).not.toHaveBeenCalled()
	})

	it.each([
		{
			label: 'a non-magic bytes4 return',
			getCall: async () => AbiFunction.encodeResult(isValidSignature, '0xffffffff'),
			expectedKind: 'invalid',
		},
		{
			label: 'malformed ABI output',
			getCall: async () => '0x1626ba7e',
			expectedKind: 'malformed-return',
		},
		{
			label: 'an RPC rejection',
			getCall: async () => {
				throw new Error('execution reverted')
			},
			expectedKind: 'call-failed',
		},
	] as const)('does not promote $label to valid evidence', async ({ getCall, expectedKind }) => {
		expect((await evaluate(getCall)).result.kind).toBe(expectedKind)
	})

	it('rejects signature substitution before the native call', async () => {
		const getCall = vi.fn(async () => '0x')
		await expect(evaluateEvmErc1271Signature({
			authorityEnvelope,
			authorityRequestId: 'authority-request-1',
			blockTag: '0x2a',
			dispatchOccurrenceId: 'dispatch-occurrence-1',
			evaluatedAt: 1_700_000_000_000,
			signature: '0x1234',
			signatureHash,
			transport: {
				origin: 'http://127.0.0.1:8545',
				getCall,
			},
		})).rejects.toThrow('do not match the dispatch signature hash')
		expect(getCall).not.toHaveBeenCalled()
	})

	it.each(['0x', '0x00', '0x01', '0xA'] as const)(
		'rejects non-canonical block tag %s before RPC',
		async (blockTag) => {
			const getCall = vi.fn(async () => '0x')
			await expect(evaluateEvmErc1271Signature({
				authorityEnvelope,
				authorityRequestId: 'authority-request-1',
				blockTag,
				dispatchOccurrenceId: 'dispatch-occurrence-1',
				evaluatedAt: 1_700_000_000_000,
				signature,
				signatureHash,
				transport: {
					origin: 'http://127.0.0.1:8545',
					getCall,
				},
			})).rejects.toThrow()
			expect(getCall).not.toHaveBeenCalled()
		}
	)

	it.each([0, Number.MAX_SAFE_INTEGER + 1])(
		'rejects personal-sign chain %s before RPC',
		async (chainId) => {
			const getCall = vi.fn(async () => '0x')
			await expect(evaluate(getCall, {
				adapterKey: 'evm.personal-sign',
				adapterVersion: '1',
				value: { chainId, accountAddress, message: 'approve action 41' },
			})).rejects.toThrow()
			expect(getCall).not.toHaveBeenCalled()
		}
	)
})
