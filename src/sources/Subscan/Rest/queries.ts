import { throwHttpError } from '$/lib/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	subscanBlockListResponseWire,
	subscanBlockResponseWire,
	subscanExtrinsicListResponseWire,
	subscanExtrinsicResponseWire,
	subscanReferendumListResponseWire,
	subscanReferendumResponseWire,
	subscanStatusWire,
	type SubscanBlock,
	type SubscanBlockListItem,
	type SubscanExtrinsic,
	type SubscanReferendum,
} from '$/sources/Subscan/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import bindings from '$/sources/Subscan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Subscan_Rest][0]

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Subscan_Rest: invalid ${label} response envelope`)
	}
}

const post = async ({
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
	const result = await response.json<unknown>()
	try {
		const status = subscanStatusWire.assert(result)
		if (status.code !== 0)
			throw new Error(`Subscan ${path} failed: ${status.message}`)
	} catch (error) {
		if (error instanceof Error && error.message.startsWith(`Subscan ${path} failed:`))
			throw error
	}
	return result
}

const assertSafePagination = ({
	page,
	row,
	label,
}: {
	page: number
	row: number
	label: string
}) => {
	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error(`Subscan ${label} page must be a nonnegative safe integer`)
	if (!Number.isSafeInteger(row) || row < 1 || row > 100)
		throw new Error(`Subscan ${label} row limit must be a safe integer from 1 through 100`)
	if (!Number.isSafeInteger(page * row))
		throw new Error(`Subscan ${label} page offset must be a safe integer`)
}

const assertExtrinsicIdentity = ({
	extrinsic,
	expectedBlockNumber,
	expectedAccountId,
}: {
	extrinsic: SubscanExtrinsic
	expectedBlockNumber?: bigint
	expectedAccountId?: string
}) => {
	const [blockNumber, indexInBlock, ...unexpected] = extrinsic.extrinsic_index.split('-')
	if (
		unexpected.length > 0
		|| !/^(?:0|[1-9]\d*)$/.test(blockNumber)
		|| !/^(?:0|[1-9]\d*)$/.test(indexInBlock)
		|| BigInt(blockNumber) !== BigInt(extrinsic.block_num)
		|| BigInt(indexInBlock) > BigInt(Number.MAX_SAFE_INTEGER)
	)
		throw new Error('Subscan extrinsics returned a malformed identity')
	if (expectedBlockNumber != null && BigInt(extrinsic.block_num) !== expectedBlockNumber)
		throw new Error('Subscan extrinsics returned a foreign block row')
	if (expectedAccountId != null && extrinsic.account_id !== expectedAccountId)
		throw new Error('Subscan account extrinsics returned a foreign account row')
}

const assertBlockDetail = (
	block: SubscanBlock,
	height?: bigint
) => {
	if (height != null && BigInt(block.block_num) !== height)
		throw new Error('Subscan block response does not match the subject')
	return block
}

const assertBlockListItem = (
	block: SubscanBlockListItem
) => {
	if (!Number.isSafeInteger(block.block_num) || block.block_num < 0)
		throw new Error('Subscan block list returned an invalid block identity')
	if (block.hash.length === 0)
		throw new Error('Subscan block list returned a malformed hash')
	return block
}

export const getBlock = async ({
	height,
	publicEnv,
}: {
	height: bigint
	publicEnv: SourcePublicEnv
}) => {
	if (height < 0n || height > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('Subscan block height must be a nonnegative safe integer')

	const response = assertEnvelope(
		'block',
		subscanBlockResponseWire,
		await post({
			path: '/api/scan/block',
			body: {
				block_num: Number(height),
			},
			publicEnv,
		})
	)
	assertBlockDetail(response.data, height)
	return response
}

export const listBlocks = async ({
	page,
	row,
	publicEnv,
}: {
	page: number
	row: number
	publicEnv: SourcePublicEnv
}) => {
	assertSafePagination({
		page,
		row,
		label: 'block',
	})

	const response = assertEnvelope(
		'blocks',
		subscanBlockListResponseWire,
		await post({
			path: '/api/v2/scan/blocks',
			body: {
				page,
				row,
			},
			publicEnv,
		})
	)
	if (response.data.blocks.length > row)
		throw new Error('Subscan block list exceeded the requested row limit')

	const blockNumbers = new Set<number>()
	let previousBlockNumber: number | undefined
	for (const block of response.data.blocks) {
		assertBlockListItem(block)
		if (blockNumbers.has(block.block_num))
			throw new Error('Subscan block list returned a duplicate block identity')
		if (previousBlockNumber != null && block.block_num >= previousBlockNumber)
			throw new Error('Subscan block list is not newest-first')
		blockNumbers.add(block.block_num)
		previousBlockNumber = block.block_num
	}

	if (
		response.data.blocks.length > 0
		&& page * row + response.data.blocks.length > response.data.count
	)
		throw new Error('Subscan block list exceeded its reported count')

	return response
}

export const getExtrinsic = async ({
	extrinsicIndex,
	publicEnv,
}: {
	extrinsicIndex: string
	publicEnv: SourcePublicEnv
}) => {
	if (extrinsicIndex.length === 0)
		throw new Error('Subscan extrinsic index must not be empty')

	const response = assertEnvelope(
		'extrinsic',
		subscanExtrinsicResponseWire,
		await post({
			path: '/api/scan/extrinsic',
			body: {
				extrinsic_index: extrinsicIndex,
			},
			publicEnv,
		})
	)
	assertExtrinsicIdentity({
		extrinsic: response.data,
	})
	if (response.data.extrinsic_index !== extrinsicIndex)
		throw new Error('Subscan extrinsic response does not match the subject')

	return response
}

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
	assertSafePagination({
		page,
		row,
		label: 'extrinsic',
	})

	const response = assertEnvelope(
		'account extrinsics',
		subscanExtrinsicListResponseWire,
		await post({
			path: '/api/scan/extrinsics',
			body: {
				address: accountId,
				page,
				row,
				signed: 'signed',
			},
			publicEnv,
		})
	)
	if (response.data.extrinsics.length > row)
		throw new Error('Subscan account extrinsics exceeded the requested row limit')

	const extrinsicIdentities = new Set<string>()
	for (const extrinsic of response.data.extrinsics) {
		assertExtrinsicIdentity({
			extrinsic,
			expectedAccountId: accountId,
		})
		if (extrinsicIdentities.has(extrinsic.extrinsic_index))
			throw new Error('Subscan account extrinsics returned a duplicate identity')
		extrinsicIdentities.add(extrinsic.extrinsic_index)
	}

	if (
		response.data.extrinsics.length > 0
		&& page * row + response.data.extrinsics.length > response.data.count
	)
		throw new Error('Subscan account extrinsics exceeded its reported count')

	return response
}

export const listBlockExtrinsics = async ({
	blockNumber,
	page,
	row,
	publicEnv,
}: {
	blockNumber: bigint
	page: number
	row: number
	publicEnv: SourcePublicEnv
}) => {
	if (blockNumber < 0n || blockNumber > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('Subscan block number must be a nonnegative safe integer')
	assertSafePagination({
		page,
		row,
		label: 'block extrinsic',
	})

	const response = assertEnvelope(
		'block extrinsics',
		subscanExtrinsicListResponseWire,
		await post({
			path: '/api/scan/extrinsics',
			body: {
				block_num: Number(blockNumber),
				page,
				row,
			},
			publicEnv,
		})
	)
	if (response.data.extrinsics.length > row)
		throw new Error('Subscan block extrinsics exceeded the requested row limit')

	const extrinsicIdentities = new Set<string>()
	for (const extrinsic of response.data.extrinsics) {
		assertExtrinsicIdentity({
			extrinsic,
			expectedBlockNumber: blockNumber,
		})
		if (extrinsicIdentities.has(extrinsic.extrinsic_index))
			throw new Error('Subscan block extrinsics returned a duplicate identity')
		extrinsicIdentities.add(extrinsic.extrinsic_index)
	}

	if (
		response.data.extrinsics.length > 0
		&& page * row + response.data.extrinsics.length > response.data.count
	)
		throw new Error('Subscan block extrinsics exceeded its reported count')

	return response
}

export const getReferendum = async ({
	referendumIndex,
	publicEnv,
}: {
	referendumIndex: number
	publicEnv: SourcePublicEnv
}) => {
	if (!Number.isSafeInteger(referendumIndex) || referendumIndex < 0)
		throw new Error('Subscan referendum index must be a nonnegative safe integer')

	const response = assertEnvelope(
		'referendum',
		subscanReferendumResponseWire,
		await post({
			path: '/api/scan/referenda/referendum',
			body: {
				referendum_index: referendumIndex,
			},
			publicEnv,
		})
	)
	if (response.data.referendum_index !== referendumIndex)
		throw new Error('Subscan referendum response does not match the subject')

	return response
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
	assertSafePagination({
		page,
		row,
		label: 'referendum',
	})
	if (status === '')
		throw new Error('Subscan referendum status must not be empty')
	if (origin === '')
		throw new Error('Subscan referendum origin must not be empty')
	if (statuses?.length === 0 || statuses?.some((candidateStatus) => candidateStatus === ''))
		throw new Error('Subscan referendum statuses must contain nonempty values')
	if (status != null && statuses != null)
		throw new Error('Subscan referendum status filters are ambiguous')

	const distinctStatuses = statuses == null ? undefined : [...new Set(statuses)]
	const response = assertEnvelope(
		'referenda',
		subscanReferendumListResponseWire,
		await post({
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
	)
	if (response.data.list.length > row)
		throw new Error('Subscan referendum list exceeded the requested row limit')

	const referendumIndexes = new Set<number>()
	for (const referendum of response.data.list) {
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

export const referendumLifecycleBlockNumbers = (
	referendum: SubscanReferendum
) => {
	let confirmationStartedAtBlockNumber: bigint | undefined
	let decidedAtBlockNumber: bigint | undefined
	let enactmentAtBlockNumber: bigint | undefined

	for (const observation of referendum.timeline) {
		const status = observation.status.toLowerCase()
		if (
			confirmationStartedAtBlockNumber == null
			&& (
				status === 'confirming'
				|| status === 'confirmationstarted'
				|| status === 'confirmation_started'
			)
		)
			confirmationStartedAtBlockNumber = BigInt(observation.block)
		if (
			decidedAtBlockNumber == null
			&& (
				status === 'approved'
				|| status === 'rejected'
				|| status === 'cancelled'
				|| status === 'canceled'
				|| status === 'timedout'
				|| status === 'timed_out'
				|| status === 'killed'
				|| status === 'decided'
			)
		)
			decidedAtBlockNumber = BigInt(observation.block)
		if (
			enactmentAtBlockNumber == null
			&& (
				status === 'executed'
				|| status === 'enactment'
				|| status === 'enacted'
			)
		)
			enactmentAtBlockNumber = BigInt(observation.block)
	}

	return {
		...(confirmationStartedAtBlockNumber != null && {
			confirmationStartedAtBlockNumber,
		}),
		...(decidedAtBlockNumber != null && {
			decidedAtBlockNumber,
		}),
		...(enactmentAtBlockNumber != null && {
			enactmentAtBlockNumber,
		}),
	}
}
