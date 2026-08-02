import { throwHttpError } from '$/lib/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	SubscanBlock,
	SubscanExtrinsic,
	SubscanExtrinsicList,
	SubscanReferendum,
	SubscanReferendumList,
	SubscanResponse,
} from '$/sources/Subscan/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import bindings from '$/sources/Subscan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Subscan_Rest][0]

const post = async <_Result>({
	path,
	body,
	publicEnv,
}: {
	path: string
	body: JsonValue
	publicEnv: SourcePublicEnv
}) => {
	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'X-API-Key': publicEnv.PUBLIC_SUBSCAN_API_KEY,
			},
			body: JSON.stringify(body),
		}
	)
	if (!response.ok) await throwHttpError(`Subscan ${path}`, response)
	const result = await response.json<SubscanResponse<_Result>>()
	if (result.code !== 0)
		throw new Error(`Subscan ${path} failed: ${result.message}`)
	return result
}

export const getBlock = ({
	height,
	publicEnv,
}: {
	height: bigint
	publicEnv: SourcePublicEnv
}) => (
	post<SubscanBlock>({
		path: '/api/scan/block',
		body: {
			block_num: Number(height),
		},
		publicEnv,
	})
)

export const getExtrinsic = ({
	extrinsicIndex,
	publicEnv,
}: {
	extrinsicIndex: string
	publicEnv: SourcePublicEnv
}) => (
	post<SubscanExtrinsic>({
		path: '/api/scan/extrinsic',
		body: {
			extrinsic_index: extrinsicIndex,
		},
		publicEnv,
	})
)

export const listAccountExtrinsics = async ({
	accountId,
	page,
	row,
	publicEnv,
}: {
	accountId: string
	page: number
	row: number
	publicEnv: SourcePublicEnv
}) => {
	if (accountId.length === 0)
		throw new Error('Subscan account ID must not be empty')
	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error('Subscan extrinsic page must be a nonnegative safe integer')
	if (!Number.isSafeInteger(row) || row < 1 || row > 100)
		throw new Error('Subscan extrinsic row limit must be a safe integer from 1 through 100')
	if (!Number.isSafeInteger(page * row))
		throw new Error('Subscan extrinsic page offset must be a safe integer')

	const response = await post<SubscanExtrinsicList>({
		path: '/api/scan/extrinsics',
		body: {
			address: accountId,
			page,
			row,
			signed: 'signed',
		},
		publicEnv,
	})
	if (!Number.isSafeInteger(response.data.count) || response.data.count < 0)
		throw new Error('Subscan account extrinsics returned an invalid count')
	if (response.data.extrinsics.length > row)
		throw new Error('Subscan account extrinsics exceeded the requested row limit')

	const extrinsicIdentities = new Set<string>()
	for (const extrinsic of response.data.extrinsics) {
		const [blockNumber, indexInBlock, ...unexpected] = extrinsic.extrinsic_index.split('-')
		if (
			unexpected.length > 0
			|| !/^(?:0|[1-9]\d*)$/.test(blockNumber)
			|| !/^(?:0|[1-9]\d*)$/.test(indexInBlock)
			|| !Number.isSafeInteger(extrinsic.block_num)
			|| extrinsic.block_num < 0
			|| BigInt(blockNumber) !== BigInt(extrinsic.block_num)
			|| BigInt(indexInBlock) > BigInt(Number.MAX_SAFE_INTEGER)
		)
			throw new Error('Subscan account extrinsics returned a malformed identity')
		if (extrinsic.account_id !== accountId)
			throw new Error('Subscan account extrinsics returned a foreign account row')
		if (extrinsicIdentities.has(extrinsic.extrinsic_index))
			throw new Error('Subscan account extrinsics returned a duplicate identity')
		if (extrinsic.fee != null && !/^\d+$/.test(extrinsic.fee))
			throw new Error('Subscan account extrinsics returned a malformed fee')
		if (
			extrinsic.nonce != null
			&& (!Number.isSafeInteger(extrinsic.nonce) || extrinsic.nonce < 0)
		)
			throw new Error('Subscan account extrinsics returned a malformed nonce')

		extrinsicIdentities.add(extrinsic.extrinsic_index)
	}

	if (
		response.data.extrinsics.length > 0
		&& page * row + response.data.extrinsics.length > response.data.count
	)
		throw new Error('Subscan account extrinsics exceeded its reported count')

	return response
}

export const getReferendum = ({
	referendumIndex,
	publicEnv,
}: {
	referendumIndex: number
	publicEnv: SourcePublicEnv
}) => {
	if (!Number.isSafeInteger(referendumIndex) || referendumIndex < 0)
		throw new Error('Subscan referendum index must be a nonnegative safe integer')

	return post<SubscanReferendum>({
		path: '/api/scan/referenda/referendum',
		body: {
			referendum_index: referendumIndex,
		},
		publicEnv,
	})
}

export const listReferenda = async ({
	page,
	row,
	status,
	statuses,
	origin,
	publicEnv,
}: {
	page: number
	row: number
	status?: string
	statuses?: string[]
	origin?: string
	publicEnv: SourcePublicEnv
}) => {
	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error('Subscan referendum page must be a nonnegative safe integer')
	if (!Number.isSafeInteger(row) || row < 1 || row > 100)
		throw new Error('Subscan referendum row limit must be a safe integer from 1 through 100')
	if (!Number.isSafeInteger(page * row))
		throw new Error('Subscan referendum page offset must be a safe integer')
	if (status === '')
		throw new Error('Subscan referendum status must not be empty')
	if (origin === '')
		throw new Error('Subscan referendum origin must not be empty')
	if (statuses?.length === 0 || statuses?.some((candidateStatus) => candidateStatus === ''))
		throw new Error('Subscan referendum statuses must contain nonempty values')
	if (status != null && statuses != null)
		throw new Error('Subscan referendum status filters are ambiguous')

	const distinctStatuses = statuses == null ? undefined : [...new Set(statuses)]
	const response = await post<SubscanReferendumList>({
		path: '/api/scan/referenda/referendums',
		body: {
			page,
			row,
			...(status != null && { status }),
			...(distinctStatuses != null && { multi_status: distinctStatuses }),
			...(origin != null && { origin }),
		},
		publicEnv,
	})
	if (!Number.isSafeInteger(response.data.count) || response.data.count < 0)
		throw new Error('Subscan referendum list returned an invalid count')
	if (response.data.list.length > row)
		throw new Error('Subscan referendum list exceeded the requested row limit')

	const referendumIndexes = new Set<number>()
	for (const referendum of response.data.list) {
		if (!Number.isSafeInteger(referendum.referendum_index) || referendum.referendum_index < 0)
			throw new Error('Subscan referendum list returned an invalid referendum identity')
		if (referendumIndexes.has(referendum.referendum_index))
			throw new Error('Subscan referendum list returned a duplicate referendum identity')
		if (origin != null && referendum.origins !== origin)
			throw new Error('Subscan referendum list returned a mismatched origin')
		if (distinctStatuses != null && !distinctStatuses.includes(referendum.status))
			throw new Error('Subscan referendum list returned a mismatched status')

		referendumIndexes.add(referendum.referendum_index)
	}

	if (
		response.data.list.length > 0
		&& page * row + response.data.list.length > response.data.count
	)
		throw new Error('Subscan referendum list exceeded its reported count')

	return response
}
