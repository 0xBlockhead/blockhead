import { base58 } from '@scure/base'

import { throwHttpError } from '$/lib/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import bindings from '$/sources/Helius/bindings.ts'
import type {
	GetAssetsByOwnerPage,
	GetAssetsByOwnerResult,
	JsonRpcResponse,
} from '$/sources/Helius/Das/types.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.Helius].find(
	({ apiFamily }) => apiFamily === ApiFamily.MetaplexDasJsonRpc
)

if (binding == null)
	throw new Error('Helius DAS binding is missing')

/** Helius implementation of the canonical Metaplex DAS `getAssetsByOwner` method. */
export const getAssetsByOwner = async ({
	ownerAddress,
	publicEnv,
	limit = 1_000,
	pagination = {
		page: 1,
	},
}: {
	ownerAddress: string
	publicEnv: SourcePublicEnv
	limit?: number
	pagination?: GetAssetsByOwnerPage
}) => {
	try {
		if (base58.decode(ownerAddress).length !== 32)
			throw new Error()
	} catch {
		throw new Error('Helius DAS: invalid owner address')
	}

	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1_000)
		throw new Error('Helius DAS: limit must be an integer from 1 through 1000')
	if (pagination.page != null && (!Number.isSafeInteger(pagination.page) || pagination.page < 1))
		throw new Error('Helius DAS: page must be a positive safe integer')
	if (pagination.before != null && pagination.before.length === 0)
		throw new Error('Helius DAS: before cursor must not be empty')
	if (pagination.after != null && pagination.after.length === 0)
		throw new Error('Helius DAS: after cursor must not be empty')

	const requestId = `${ownerAddress}:${pagination.page != null ? `page:${String(pagination.page)}` : (pagination.before != null ? `before:${pagination.before}` : `after:${pagination.after}`)}`
	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding)}/?api-key=${encodeURIComponent(requiredPublicEnvString(publicEnv, 'PUBLIC_HELIUS_API_KEY'))}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: requestId,
				method: 'getAssetsByOwner',
				params: {
					ownerAddress,
					limit,
					...pagination,
					// Helius's direct DAS wire names its provider extension `displayOptions`.
					displayOptions: {
						showFungible: true,
					},
				},
			}),
		}
	)
	if (!response.ok)
		await throwHttpError('Helius DAS getAssetsByOwner', response)

	const envelope = await response.json<JsonRpcResponse<GetAssetsByOwnerResult>>()
	if (envelope.jsonrpc !== '2.0' || envelope.id !== requestId)
		throw new Error('Helius DAS: response identity does not match request')
	if (envelope.error != null)
		throw new Error(`Helius DAS: ${envelope.error.message}`)
	if (envelope.result == null)
		throw new Error('Helius DAS: response result is missing')

	return envelope.result
}
