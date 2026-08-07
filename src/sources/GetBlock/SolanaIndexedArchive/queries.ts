import { fetchFailedMessage } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	GetBlockSolanaIndexedArchiveResolution,
	getBlockSolanaIndexedArchiveResponseWire,
	type GetBlockSolanaIndexedArchiveResponse,
} from '$/sources/GetBlock/SolanaIndexedArchive/types.ts'

const assertEnvelope = (
	response: unknown
): GetBlockSolanaIndexedArchiveResponse => {
	try {
		return getBlockSolanaIndexedArchiveResponseWire.assert(response)
	} catch {
		throw new Error('GetBlock Solana Indexed Archive: invalid transaction response envelope')
	}
}

const assertSignature = (
	signature: string
) => {
	if (signature.length === 0)
		throw new Error('GetBlock Solana Indexed Archive: signature must not be empty')
}

export const getSolanaTransaction = async (
	binding: SourceBinding,
	signature: string
) => {
	assertSignature(signature)
	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/transactions`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				signature,
				include: {
					instructions: true,
				},
			}),
		}
	)
	if (response.status === 404)
		return {
			resolution: GetBlockSolanaIndexedArchiveResolution.Empty,
			transaction: null,
			missingFields: [],
		} satisfies GetBlockSolanaIndexedArchiveResponse
	if (response.status === 422)
		return {
			resolution: GetBlockSolanaIndexedArchiveResolution.Unsupported,
			transaction: null,
			missingFields: [],
		} satisfies GetBlockSolanaIndexedArchiveResponse
	if (!response.ok)
		throw new Error(await fetchFailedMessage('GetBlock Solana Indexed Archive transaction', response))

	const envelope = assertEnvelope(await response.json())
	if (
		envelope.resolution === GetBlockSolanaIndexedArchiveResolution.Complete
		&& (
			envelope.transaction == null
			|| envelope.transaction.signature !== signature
		)
	)
		throw new Error('GetBlock Solana Indexed Archive: complete response identity mismatch')

	return envelope
}
