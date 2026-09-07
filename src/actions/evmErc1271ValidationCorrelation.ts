import {
	actionAuthorityRequestEnvelopeHash,
	type ActionAuthorityRequestEnvelope,
	type ActionDispatchEvidence,
} from '$/actions/execution.ts'
import type { EvmErc1271SignatureValidation } from '$/schema/EvmErc1271SignatureValidationEvidence.ts'


export const assertEvmErc1271ValidationCorrelation = ({
	address,
	authorityEnvelope,
	authorityEnvelopeHash,
	authorityRequestId,
	dispatchEvidence,
	localEffectFingerprint,
	occurrenceId,
	validation,
}: {
	address: { method: string } | undefined
	authorityEnvelope: ActionAuthorityRequestEnvelope
	authorityEnvelopeHash: string | undefined
	authorityRequestId: string
	dispatchEvidence: ActionDispatchEvidence | undefined
	localEffectFingerprint: string | undefined
	occurrenceId: string
	validation: EvmErc1271SignatureValidation
}) => {
	if (validation.dispatchOccurrenceId !== occurrenceId)
		throw new Error('ERC-1271 validation does not identify its dispatch occurrence.')
	if (validation.authorityRequestId !== authorityRequestId)
		throw new Error('ERC-1271 validation does not identify its authority request.')
	if (address?.method !== 'personal_sign' && address?.method !== 'eth_signTypedData_v4')
		throw new Error('ERC-1271 validation requires an EVM signature dispatch occurrence.')
	if (dispatchEvidence?.kind !== 'returned' || dispatchEvidence.response.adapterKey !== 'evm.signature')
		throw new Error('ERC-1271 validation requires returned EVM signature evidence.')
	if (dispatchEvidence.response.value.signatureHash !== validation.signatureHash)
		throw new Error('ERC-1271 validation signature hash does not match dispatch evidence.')
	if (authorityEnvelopeHash !== validation.authorityEnvelopeHash)
		throw new Error('ERC-1271 validation does not bind the persisted authority envelope hash.')
	if (actionAuthorityRequestEnvelopeHash(authorityEnvelope) !== validation.authorityEnvelopeHash)
		throw new Error('ERC-1271 validation authority envelope hash is not canonical.')
	if (localEffectFingerprint !== validation.authorityEnvelopeHash)
		throw new Error('ERC-1271 validation does not bind the dispatch effect fingerprint.')
	if (authorityEnvelope.adapterKey !== 'evm.personal-sign' && authorityEnvelope.adapterKey !== 'evm.typed-data')
		throw new Error('ERC-1271 validation requires an EVM signing authority envelope.')
	const expectedMethod = authorityEnvelope.adapterKey === 'evm.personal-sign'
		? 'personal_sign'
		: 'eth_signTypedData_v4'
	if (address.method !== expectedMethod)
		throw new Error('ERC-1271 validation method does not match its authority envelope.')
	if (authorityEnvelope.value.chainId !== validation.chainId)
		throw new Error('ERC-1271 validation chain does not match its authority envelope.')
	if (authorityEnvelope.value.accountAddress.toLowerCase() !== validation.accountAddress)
		throw new Error('ERC-1271 validation account does not match its authority envelope.')
}
