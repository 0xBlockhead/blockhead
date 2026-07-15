import { fetchFailedMessage } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	GetBlockSolanaIndexedArchiveResolution,
	type GetBlockSolanaIndexedArchiveRequest,
	type GetBlockSolanaIndexedArchiveResponse,
} from '$/sources/GetBlock/SolanaIndexedArchive/types.ts'

export const getSolanaTransaction = async (
	binding: SourceBinding,
	signature: string
): Promise<GetBlockSolanaIndexedArchiveResponse> => {
	const request: GetBlockSolanaIndexedArchiveRequest = {
		signature,
		include: {
			instructions: true,
		},
	}
	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/transactions`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(request),
		}
	)
	if (response.status === 404)
		return {
			resolution: GetBlockSolanaIndexedArchiveResolution.Empty,
			transaction: null,
			missingFields: [],
		}
	if (response.status === 422)
		return {
			resolution: GetBlockSolanaIndexedArchiveResolution.Unsupported,
			transaction: null,
			missingFields: [],
		}
	if (!response.ok)
		throw new Error(await fetchFailedMessage('GetBlock Solana Indexed Archive transaction', response))

	return response.json<GetBlockSolanaIndexedArchiveResponse>()
}
