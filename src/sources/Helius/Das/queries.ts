import { base58 } from '@scure/base'

import { throwHttpError } from '$/lib/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import bindings from '$/sources/Helius/bindings.ts'
import type {
	GetAssetsByOwnerPage,
	GetTokenAccountsPage,
	JsonRpcResponse,
} from '$/sources/Helius/Das/types.ts'
import {
	dasAssetListWire,
	dasAssetProofWire,
	dasAssetWire,
	dasTokenAccountListWire,
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

const assertSolanaAddress = (
	value: string,
	label: string,
) => {
	try {
		if (base58.decode(value).length !== 32)
			throw new Error()
	} catch {
		throw new Error(`Helius DAS: invalid ${label}`)
	}
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown,
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Helius DAS: invalid ${label} response envelope`)
	}
}

const assertPagination = (
	pagination: GetAssetsByOwnerPage | GetTokenAccountsPage,
) => {
	if (pagination.page != null && (!Number.isSafeInteger(pagination.page) || pagination.page < 1))
		throw new Error('Helius DAS: page must be a positive safe integer')
	if (pagination.before != null && pagination.before.length === 0)
		throw new Error('Helius DAS: before cursor must not be empty')
	if (pagination.after != null && pagination.after.length === 0)
		throw new Error('Helius DAS: after cursor must not be empty')
}

const assertLimit = (
	limit: number,
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1_000)
		throw new Error('Helius DAS: limit must be an integer from 1 through 1000')
}

const paginationRequestId = (
	prefix: string,
	pagination: GetAssetsByOwnerPage | GetTokenAccountsPage,
) => (
	pagination.page != null ?
		`${prefix}:page:${String(pagination.page)}`
	: pagination.before != null ?
		`${prefix}:before:${pagination.before}`
	:
		`${prefix}:after:${pagination.after}`
)

const dasRpc = async <_Result>({
	method,
	requestId,
	params,
	publicEnv,
}: {
	method: string
	requestId: string
	params: Record<string, unknown>
	publicEnv: SourcePublicEnv
}) => {
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
				method,
				params,
			}),
		}
	)
	if (!response.ok)
		await throwHttpError(`Helius DAS ${method}`, response)

	const envelope = await response.json<JsonRpcResponse<_Result>>()
	if (envelope.jsonrpc !== '2.0' || envelope.id !== requestId)
		throw new Error('Helius DAS: response identity does not match request')
	if (envelope.error != null)
		throw new Error(`Helius DAS: ${envelope.error.message}`)
	if (envelope.result == null)
		throw new Error('Helius DAS: response result is missing')

	return envelope.result
}

/** Helius implementation of the canonical Metaplex DAS `getAsset` method. */
export const getAsset = async ({
	id,
	publicEnv,
}: {
	id: string
	publicEnv: SourcePublicEnv
}) => {
	assertSolanaAddress(id, 'asset id')

	return assertEnvelope(
		'getAsset',
		dasAssetWire,
		await dasRpc({
			method: 'getAsset',
			requestId: `getAsset:${id}`,
			params: {
				id,
				displayOptions: {
					showFungible: true,
				},
			},
			publicEnv,
		}),
	)
}

/** Helius implementation of the canonical Metaplex DAS `getAssets` method. */
export const getAssets = async ({
	ids,
	publicEnv,
}: {
	ids: readonly string[]
	publicEnv: SourcePublicEnv
}) => {
	if (ids.length === 0)
		throw new Error('Helius DAS: asset ids must not be empty')
	if (ids.length > 1_000)
		throw new Error('Helius DAS: asset ids must not exceed 1000')
	for (const id of ids)
		assertSolanaAddress(id, 'asset id')

	const assets = assertEnvelope(
		'getAssets',
		dasAssetWire.or('null').array(),
		await dasRpc({
			method: 'getAssets',
			requestId: `getAssets:${ids.join(',')}`,
			params: {
				ids: [...ids],
				displayOptions: {
					showFungible: true,
				},
			},
			publicEnv,
		}),
	)

	if (assets.length !== ids.length)
		throw new Error('Helius DAS: invalid getAssets response envelope')

	return assets
}

/** Helius implementation of the canonical Metaplex DAS `getAssetProof` method. */
export const getAssetProof = async ({
	id,
	publicEnv,
}: {
	id: string
	publicEnv: SourcePublicEnv
}) => {
	assertSolanaAddress(id, 'asset id')

	return assertEnvelope(
		'getAssetProof',
		dasAssetProofWire,
		await dasRpc({
			method: 'getAssetProof',
			requestId: `getAssetProof:${id}`,
			params: {
				id,
			},
			publicEnv,
		}),
	)
}

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
	assertSolanaAddress(ownerAddress, 'owner address')
	assertLimit(limit)
	assertPagination(pagination)

	return assertEnvelope(
		'getAssetsByOwner',
		dasAssetListWire,
		await dasRpc({
			method: 'getAssetsByOwner',
			requestId: paginationRequestId(ownerAddress, pagination),
			params: {
				ownerAddress,
				limit,
				...pagination,
				// Helius's direct DAS wire names its provider extension `displayOptions`.
				displayOptions: {
					showFungible: true,
				},
			},
			publicEnv,
		}),
	)
}

/**
 * Helius implementation of Metaplex DAS `getTokenAccounts`.
 * Orthogonal to Solana JsonRpc `getTokenAccountsByOwner` — same SPL surface, DAS inventory wire.
 */
export const getTokenAccounts = async ({
	publicEnv,
	ownerAddress,
	mintAddress,
	limit = 1_000,
	pagination = {
		page: 1,
	},
}: {
	publicEnv: SourcePublicEnv
	ownerAddress?: string
	mintAddress?: string
	limit?: number
	pagination?: GetTokenAccountsPage
}) => {
	if (ownerAddress == null && mintAddress == null)
		throw new Error('Helius DAS: getTokenAccounts requires ownerAddress or mintAddress')
	if (ownerAddress != null)
		assertSolanaAddress(ownerAddress, 'owner address')
	if (mintAddress != null)
		assertSolanaAddress(mintAddress, 'mint address')
	assertLimit(limit)
	assertPagination(pagination)

	const subject = (
		ownerAddress != null ?
			`owner:${ownerAddress}`
		:
			`mint:${mintAddress}`
	)

	return assertEnvelope(
		'getTokenAccounts',
		dasTokenAccountListWire,
		await dasRpc({
			method: 'getTokenAccounts',
			requestId: paginationRequestId(subject, pagination),
			params: {
				...(ownerAddress != null && {
					ownerAddress,
				}),
				...(mintAddress != null && {
					mintAddress,
				}),
				limit,
				...pagination,
				displayOptions: {
					showFungible: true,
				},
			},
			publicEnv,
		}),
	)
}
