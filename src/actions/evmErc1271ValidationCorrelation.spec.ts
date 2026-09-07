import { describe, expect, it } from 'vitest'

import {
	actionAuthorityRequestEnvelopeHash,
	type ActionAuthorityRequestEnvelope,
	type ActionDispatchEvidence,
} from '$/actions/execution.ts'
import { assertEvmErc1271ValidationCorrelation } from '$/actions/evmErc1271ValidationCorrelation.ts'
import type { EvmErc1271SignatureValidation } from '$/schema/EvmErc1271SignatureValidationEvidence.ts'
import { EvmAddress, Hash32 } from '$/schema/ZeroExHex.ts'

const occurrenceId = 'dispatch-occurrence-erc1271-1'
const authorityRequestId = 'authority-request-1'
const accountAddress: typeof EvmAddress.infer = '0xAbCdEfabcdefABCDEFabcdefabcdefabcdefABCD'
const signatureHash = Hash32.assert(`0x${'11'.repeat(32)}`)

const envelope: ActionAuthorityRequestEnvelope = {
	adapterKey: 'evm.personal-sign',
	adapterVersion: '1',
	value: { chainId: 1, accountAddress, message: 'Approve this action' },
}
const envelopeHash = actionAuthorityRequestEnvelopeHash(envelope)
const evidence: ActionDispatchEvidence = {
	kind: 'returned',
	response: { adapterKey: 'evm.signature', adapterVersion: '1', value: { signatureHash } },
}
const validation: EvmErc1271SignatureValidation = {
	standard: 'ERC-1271', dispatchOccurrenceId: occurrenceId, authorityRequestId,
	authorityEnvelopeHash: envelopeHash, chainId: 1, accountAddress: accountAddress.toLowerCase(),
	requestDigest: Hash32.assert(`0x${'22'.repeat(32)}`), signatureHash, rpcOrigin: 'https://rpc.example.test',
	blockTag: '0x10', callDataHash: Hash32.assert(`0x${'33'.repeat(32)}`), evaluatedAt: 1,
	coverage: 'isValidSignature(bytes32,bytes)-eth_call-only', result: {
		kind: 'valid', magicValue: '0x1626ba7e', outputHash: Hash32.assert(`0x${'44'.repeat(32)}`),
	},
}

const input = () => ({
	address: { method: 'personal_sign' }, authorityEnvelope: envelope, authorityEnvelopeHash: envelopeHash,
	authorityRequestId,
	dispatchEvidence: evidence, localEffectFingerprint: envelopeHash, occurrenceId, validation,
})

describe('ERC-1271 validation correlation', () => {
	it.each([
		['personal-sign', input()],
		['typed-data', { ...input(), address: { method: 'eth_signTypedData_v4' }, authorityEnvelope: {
			adapterKey: 'evm.typed-data', adapterVersion: '1', value: { chainId: 1, accountAddress, typedDataJson: '{"x":1}' },
		}, }],
	])('accepts %s', (_, candidate) => {
		const typedEnvelopeHash = actionAuthorityRequestEnvelopeHash(candidate.authorityEnvelope)
		expect(() => assertEvmErc1271ValidationCorrelation({ ...candidate, authorityEnvelopeHash: typedEnvelopeHash, localEffectFingerprint: typedEnvelopeHash, validation: { ...candidate.validation, authorityEnvelopeHash: typedEnvelopeHash } })).not.toThrow()
	})

	it.each([
		['occurrence mismatch', { occurrenceId: 'other' }, 'does not identify'],
		['non-signing dispatch method', { address: { method: 'eth_sendTransaction' } }, 'requires an EVM signature'],
		['non-returned evidence', { dispatchEvidence: undefined }, 'requires returned'],
		['wrong adapter evidence', { dispatchEvidence: { kind: 'returned', response: { adapterKey: 'evm.transaction', adapterVersion: '1', value: { transactionIds: [] } } } }, 'requires returned'],
		['signature hash mismatch', { dispatchEvidence: { ...evidence, response: { ...evidence.response, value: { signatureHash: Hash32.assert(`0x${'55'.repeat(32)}`) } } } }, 'signature hash'],
		['envelope hash mismatch', { authorityEnvelopeHash: Hash32.assert(`0x${'66'.repeat(32)}`) }, 'persisted authority'],
		['canonical hash mismatch', { validation: { ...validation, authorityEnvelopeHash: Hash32.assert(`0x${'77'.repeat(32)}`) } }, 'canonical'],
		['authority request mismatch', { authorityRequestId: 'authority-request-2' }, 'authority request'],
		['effect fingerprint mismatch', { localEffectFingerprint: Hash32.assert(`0x${'88'.repeat(32)}`) }, 'effect fingerprint'],
		['adapter mismatch', { authorityEnvelope: { ...envelope, adapterKey: 'evm.transaction', value: { method: 'eth_sendTransaction', chainId: 1, accountAddress, calls: [{ inputData: '0x', inputDataHash: Hash32.assert(`0x${'99'.repeat(32)}`) }] } } }, 'EVM signing'],
		['method mismatch', { address: { method: 'eth_signTypedData_v4' } }, 'method does not match'],
		['chain mismatch', { validation: { ...validation, chainId: 2 } }, 'chain does not match'],
		['account mismatch', { validation: { ...validation, accountAddress: '0x0000000000000000000000000000000000000001' } }, 'account does not match'],
	])('rejects %s', (label, overrides, message) => {
		const candidate = { ...input(), ...overrides }
		if (label === 'canonical hash mismatch') {
			const mismatchedHash = Hash32.assert(`0x${'77'.repeat(32)}`)
			candidate.authorityEnvelopeHash = mismatchedHash
			candidate.validation = { ...candidate.validation, authorityEnvelopeHash: mismatchedHash }
		}
		if (candidate.authorityEnvelope.adapterKey === 'evm.transaction') {
			const hash = actionAuthorityRequestEnvelopeHash(candidate.authorityEnvelope)
			candidate.authorityEnvelopeHash = hash
			candidate.localEffectFingerprint = hash
			candidate.validation = { ...candidate.validation, authorityEnvelopeHash: hash }
		}
		expect(() => assertEvmErc1271ValidationCorrelation(candidate)).toThrow(message)
	})
})
