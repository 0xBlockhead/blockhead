import { describe, expect, it } from 'vitest'

import {
	erc1271MagicValue,
	evmErc1271SignatureValidation,
} from './EvmErc1271SignatureValidationEvidence.ts'


const validation = {
	standard: 'ERC-1271',
	dispatchOccurrenceId: 'dispatch-occurrence-1',
	authorityRequestId: 'authority-request-1',
	authorityEnvelopeHash: `0x${'11'.repeat(32)}`,
	chainId: 1,
	accountAddress: '0x2222222222222222222222222222222222222222',
	requestDigest: `0x${'33'.repeat(32)}`,
	signatureHash: `0x${'44'.repeat(32)}`,
	rpcOrigin: 'http://127.0.0.1:8545',
	blockTag: '0x2a',
	callDataHash: `0x${'55'.repeat(32)}`,
	evaluatedAt: 1_700_000_000_000,
	coverage: 'isValidSignature(bytes32,bytes)-eth_call-only',
	result: {
		kind: 'valid',
		magicValue: erc1271MagicValue,
		outputHash: `0x${'66'.repeat(32)}`,
	},
} as const

describe('EVM ERC-1271 signature validation evidence', () => {
	it('accepts only the exact magic value as a valid account-contract signature', () => {
		expect(evmErc1271SignatureValidation.assert(validation)).toEqual(validation)
		expect(() => evmErc1271SignatureValidation.assert({
			...validation,
			result: {
				...validation.result,
				magicValue: '0xffffffff',
			},
		})).toThrow()
	})

	it('cannot label the ERC-1271 magic value as invalid', () => {
		expect(() => evmErc1271SignatureValidation.assert({
			...validation,
			result: {
				kind: 'invalid',
				magicValue: erc1271MagicValue,
				outputHash: validation.result.outputHash,
			},
		})).toThrow()
	})

	it.each(['0x', '0x00', '0x01', '0xA'])(
		'rejects non-canonical block tag %s',
		(blockTag) => {
			expect(() => evmErc1271SignatureValidation.assert({
				...validation,
				blockTag,
			})).toThrow()
		}
	)

	it.each([0, Number.MAX_SAFE_INTEGER + 1])('rejects invalid chain %s', (chainId) => {
		expect(() => evmErc1271SignatureValidation.assert({
			...validation,
			chainId,
		})).toThrow()
	})
})
