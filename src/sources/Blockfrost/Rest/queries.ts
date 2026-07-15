import { throwHttpError } from '$/lib/http.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	BlockfrostAssets,
	BlockfrostBlock,
	BlockfrostBlocks,
	BlockfrostCommittee,
	BlockfrostDReps,
	BlockfrostEpoch,
	BlockfrostGovernanceProposals,
	BlockfrostHealth,
	BlockfrostNetwork,
	BlockfrostProtocolParameters,
	BlockfrostStakePools,
	BlockfrostTransactions,
} from '$/sources/Blockfrost/Rest/types.ts'

export const request = async <_Response>({
	binding,
	path,
}: {
	binding: SourceBinding
	path: string
}) => {
	const response = await sourceFetch(
		binding,
		new URL(path, firstHttpUrlForBinding(binding)).toString()
	)

	if (!response.ok)
		await throwHttpError('Blockfrost_Rest', response)

	return response.json<_Response>()
}

const get = <_Response>(binding: SourceBinding, path: string) => (
	request<_Response>({
		binding,
		path,
	})
)

const listPage = <_Response>(
	binding: SourceBinding,
	path: string,
	count: number
) => {
	if (!Number.isSafeInteger(count) || count < 0 || count > 100)
		throw new Error('Blockfrost_Rest: list count must be an integer from 0 through 100')

	return count === 0
		? Promise.resolve<_Response[]>([])
		: get<_Response[]>(binding, `${path}?count=${count.toString()}`)
}

export const getHealth = (binding: SourceBinding) => (
	get<BlockfrostHealth>(binding, 'health')
)

export const getLatestBlock = (binding: SourceBinding) => (
	get<BlockfrostBlock>(binding, 'blocks/latest')
)

export const getBlock = (binding: SourceBinding, blockId: string) => (
	get<BlockfrostBlock>(binding, `blocks/${encodeURIComponent(blockId)}`)
)

export const listBlocks = async (binding: SourceBinding, count: number) => {
	if (!Number.isSafeInteger(count) || count < 0 || count > 100)
		throw new Error('Blockfrost_Rest: block list count must be an integer from 0 through 100')

	if (count === 0)
		return []

	const latestBlock = await getLatestBlock(binding)
	if (count === 1)
		return [latestBlock]

	return [
		latestBlock,
		...await get<BlockfrostBlocks>(
			binding,
			`blocks/${encodeURIComponent(latestBlock.hash)}/previous?count=${(count - 1).toString()}`
		),
	]
}

export const getLatestEpoch = (binding: SourceBinding) => (
	get<BlockfrostEpoch>(binding, 'epochs/latest')
)

export const getNetwork = (binding: SourceBinding) => (
	get<BlockfrostNetwork>(binding, 'network')
)

export const listLatestBlockTransactions = (
	binding: SourceBinding,
	count: number
) => (
	listPage<BlockfrostTransactions[number]>(binding, 'blocks/latest/txs', count)
)

export const listStakePools = (binding: SourceBinding, count: number) => (
	listPage<BlockfrostStakePools[number]>(binding, 'pools', count)
)

export const listDReps = (binding: SourceBinding, count: number) => (
	listPage<BlockfrostDReps[number]>(binding, 'governance/dreps', count)
)

export const listGovernanceProposals = (
	binding: SourceBinding,
	count: number
) => (
	listPage<BlockfrostGovernanceProposals[number]>(binding, 'governance/proposals', count)
)

export const listAssets = (binding: SourceBinding, count: number) => (
	listPage<BlockfrostAssets[number]>(binding, 'assets', count)
)

export const getLatestProtocolParameters = (binding: SourceBinding) => (
	get<BlockfrostProtocolParameters>(binding, 'epochs/latest/parameters')
)

export const getCommittee = (binding: SourceBinding) => (
	get<BlockfrostCommittee>(binding, 'governance/committee')
)
