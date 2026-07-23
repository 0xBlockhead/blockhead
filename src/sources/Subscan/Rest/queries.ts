import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	SubscanBlock,
	SubscanExtrinsic,
	SubscanExtrinsicList,
	SubscanReferendum,
	SubscanReferendumList,
	SubscanResponse,
} from '$/sources/Subscan/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const subscanPolkadotRestEndpoints = [
	{
		url: 'https://polkadot.api.subscan.io',
		transportType: TransportType.Http,
		providerName: 'Subscan',
	},
] as const

export const subscanOrigins = [
	{
		origin: 'https://polkadot.api.subscan.io',
		corsEnabled: false,
	},
] as const

const post = async <_Result>({
	restBaseUrl,
	path,
	body,
	publicEnv,
}: {
	restBaseUrl: string
	path: string
	body: JsonValue
	publicEnv: SourcePublicEnv
}) => {
	const response = await corsFetch(`${restBaseUrl.replace(/\/$/, '')}${path}`, {
		origins: subscanOrigins,
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'X-API-Key': publicEnv.PUBLIC_SUBSCAN_API_KEY,
			},
			body: JSON.stringify(body),
		},
	})
	if (!response.ok) await throwHttpError(`Subscan ${path}`, response)
	const result = await response.json<SubscanResponse<_Result>>()
	if (result.code !== 0)
		throw new Error(`Subscan ${path} failed: ${result.message}`)
	return result
}

export const getBlock = ({
	restBaseUrl,
	height,
	publicEnv,
}: {
	restBaseUrl: string
	height: bigint
	publicEnv: SourcePublicEnv
}) => (
	post<SubscanBlock>({
		restBaseUrl,
		path: '/api/scan/block',
		body: {
			block_num: Number(height),
		},
		publicEnv,
	})
)

export const getExtrinsic = ({
	restBaseUrl,
	extrinsicIndex,
	publicEnv,
}: {
	restBaseUrl: string
	extrinsicIndex: string
	publicEnv: SourcePublicEnv
}) => (
	post<SubscanExtrinsic>({
		restBaseUrl,
		path: '/api/scan/extrinsic',
		body: {
			extrinsic_index: extrinsicIndex,
		},
		publicEnv,
	})
)

export const listAccountExtrinsics = async ({
	restBaseUrl,
	accountId,
	page,
	row,
	publicEnv,
}: {
	restBaseUrl: string
	accountId: string
	page: number
	row: number
	publicEnv: SourcePublicEnv
}) => {
	if (accountId.length === 0)
		throw new Error('Subscan account ID must not be empty')
	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error('Subscan extrinsic page must be a nonnegative safe integer')
	if (!Number.isSafeInteger(row) || row < 0 || row > 100)
		throw new Error('Subscan extrinsic row limit must be a safe integer from 0 through 100')
	if (!Number.isSafeInteger(page * row))
		throw new Error('Subscan extrinsic page offset must be a safe integer')
	if (row === 0)
		return {
			extrinsics: [],
			pagination: {
				page,
				row,
				offset: 0,
				count: 0,
			},
		}

	const response = await post<SubscanExtrinsicList>({
		restBaseUrl,
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

	const offset = page * row
	if (
		response.data.extrinsics.length > 0
		&& offset + response.data.extrinsics.length > response.data.count
	)
		throw new Error('Subscan account extrinsics exceeded its reported count')

	return {
		extrinsics: response.data.extrinsics,
		pagination: {
			page,
			row,
			offset,
			count: response.data.count,
			...((page + 1) * row < response.data.count && {
				nextPage: page + 1,
			}),
		},
	}
}

export const getReferendum = ({
	restBaseUrl,
	referendumIndex,
	publicEnv,
}: {
	restBaseUrl: string
	referendumIndex: number
	publicEnv: SourcePublicEnv
}) => {
	if (!Number.isSafeInteger(referendumIndex) || referendumIndex < 0)
		throw new Error('Subscan referendum index must be a nonnegative safe integer')

	return post<SubscanReferendum>({
		restBaseUrl,
		path: '/api/scan/referenda/referendum',
		body: {
			referendum_index: referendumIndex,
		},
		publicEnv,
	})
}

export const listReferenda = async ({
	restBaseUrl,
	page,
	row,
	status,
	statuses,
	origin,
	publicEnv,
}: {
	restBaseUrl: string
	page: number
	row: number
	status?: string
	statuses?: string[]
	origin?: string
	publicEnv: SourcePublicEnv
}) => {
	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error('Subscan referendum page must be a nonnegative safe integer')
	if (!Number.isSafeInteger(row) || row < 0 || row > 100)
		throw new Error('Subscan referendum row limit must be a safe integer from 0 through 100')
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
	if (row === 0)
		return {
			referenda: [],
			pagination: {
				page,
				row,
				offset: 0,
				count: 0,
			},
		}

	const response = await post<SubscanReferendumList>({
		restBaseUrl,
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

	const offset = page * row
	if (response.data.list.length > 0 && offset + response.data.list.length > response.data.count)
		throw new Error('Subscan referendum list exceeded its reported count')

	return {
		referenda: response.data.list,
		pagination: {
			page,
			row,
			offset,
			count: response.data.count,
			...((page + 1) * row < response.data.count && {
				nextPage: page + 1,
			}),
		},
	}
}
