import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { sourcifyGetJsonOrNull } from '$/sources/Sourcify/Rest/client.ts'
import { contractLookupFields } from '$/sources/Sourcify/Rest/constants.ts'
import type {
	SourcifyContractLookup,
	SourcifyContractMatchList,
} from '$/sources/Sourcify/Rest/types.ts'

const hasVerificationMatch = (
	json: SourcifyContractLookup
) => (
	(json.match != null && json.match !== '')
	|| (json.creationMatch != null && json.creationMatch !== '')
	|| (json.runtimeMatch != null && json.runtimeMatch !== '')
)

export const getContractLookupPath = ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => (
	`/contract/${chainId}/${address}?${new URLSearchParams({
		fields: contractLookupFields.join(','),
	})}`
)

export const getContractLookupsByAddressPath = ({
	address,
}: {
	address: `0x${string}`
}) => (
	`/contract/all-chains/${address}`
)

export const listVerifiedContractsPath = ({
	chainId,
	limit,
	sort,
	afterMatchId,
}: {
	chainId: number
	limit?: number
	sort?: 'asc' | 'desc'
	afterMatchId?: string
}) => {
	const searchParams = new URLSearchParams()
	if (limit != null)
		searchParams.set('limit', String(Math.min(Math.max(1, Math.trunc(limit)), 200)))
	if (sort != null)
		searchParams.set('sort', sort)
	if (afterMatchId != null && afterMatchId !== '')
		searchParams.set('afterMatchId', afterMatchId)
	const query = searchParams.toString()
	return `/contracts/${chainId}${query === '' ? '' : `?${query}`}`
}

/** `GET /v2/contract/{chainId}/{address}` — verified contract lookup with product fields. */
export const getContractLookup = async ({
	chainId,
	address,
}: {
	chainId: number
	address: `0x${string}`
}) => {
	const json = await sourcifyGetJsonOrNull<SourcifyContractLookup>({
		path: getContractLookupPath({
			chainId,
			address: zeroExLowerCase(address),
		}),
	})
	if (json == null || !hasVerificationMatch(json)) return null
	return json
}

/** `GET /v2/contract/all-chains/{address}` — match summaries for one address across chains. */
export const getContractLookupsByAddress = async ({
	address,
}: {
	address: `0x${string}`
}) => {
	const json = await sourcifyGetJsonOrNull<SourcifyContractMatchList>({
		path: getContractLookupsByAddressPath({
			address: zeroExLowerCase(address),
		}),
	})
	if (json == null) return null
	return json.results
}

/** `GET /v2/contracts/{chainId}` — paginated verified-contract summaries for a chain. */
export const listVerifiedContracts = async ({
	chainId,
	limit,
	sort,
	afterMatchId,
}: {
	chainId: number
	limit?: number
	sort?: 'asc' | 'desc'
	afterMatchId?: string
}) => {
	const json = await sourcifyGetJsonOrNull<SourcifyContractMatchList>({
		path: listVerifiedContractsPath({
			chainId,
			limit,
			sort,
			afterMatchId,
		}),
	})
	if (json == null) return null
	return json.results
}
