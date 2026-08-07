import { fetchFailedMessage } from '$/lib/http.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Sqd/bindings.ts'
import {
	SqdPortalBlockHead,
	SqdPortalEvmBlock,
	type SqdPortalEvmBlockRequest,
	SqdPortalReorg,
	SqdPortalResolution,
} from '$/sources/Sqd/Portal/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.SqdPortal_RawHttp][0]

const datasetUrl = () => (
	firstHttpUrlForBinding(binding).replace(/\/$/, '')
)

const finalizedHeadFromHeaders = (response: Response) => {
	const number = response.headers.get('x-sqd-finalized-head-number')
	const hash = response.headers.get('x-sqd-finalized-head-hash')
	if (number == null || hash == null)
		return undefined

	return SqdPortalBlockHead.assert({
		number: Number(number),
		hash,
	})
}

const ndjsonBlocks = async (response: Response) => (
	(await response.text())
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line !== '')
		.map((line) => SqdPortalEvmBlock.assert(JSON.parse(line)))
)

const getBlockHead = async (
	path: '/head' | '/finalized-head',
	label: string
) => {
	const response = await sourceFetch(
		binding,
		`${datasetUrl()}${path}`
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(label, response))

	const payload = await response.json()
	if (payload == null)
		throw new Error(`${label}: empty dataset`)

	return SqdPortalBlockHead.assert(payload)
}

/** Highest available block including unfinalized hotblocks. */
export const getHead = () => (
	getBlockHead('/head', 'SQD Portal head')
)

/** Highest finalized block guaranteed not to reorganize. */
export const getFinalizedHead = () => (
	getBlockHead('/finalized-head', 'SQD Portal finalized head')
)

export const getEvmBlock = async (
	blockNumber: bigint,
	parentBlockHash?: string
) => {
	const numericBlockNumber = Number(blockNumber)
	if (!Number.isSafeInteger(numericBlockNumber) || numericBlockNumber < 0)
		throw new Error(`SQD Portal cannot address block ${blockNumber.toString()}`)

	const request: SqdPortalEvmBlockRequest = {
		type: 'evm',
		fromBlock: numericBlockNumber,
		toBlock: numericBlockNumber,
		...(parentBlockHash != null && { parentBlockHash }),
		includeAllBlocks: true,
		fields: {
			block: {
				number: true,
				hash: true,
				parentHash: true,
				timestamp: true,
				miner: true,
				gasUsed: true,
				gasLimit: true,
				baseFeePerGas: true,
				blobGasUsed: true,
				excessBlobGas: true,
			},
			transaction: {
				hash: true,
			},
		},
		transactions: [{}],
	}
	const response = await sourceFetch(
		binding,
		`${datasetUrl()}/stream`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(request),
		}
	)
	const responseFinalizedHead = finalizedHeadFromHeaders(response)
	if (response.status === 204)
		return {
			resolution: SqdPortalResolution.Empty,
			...(responseFinalizedHead != null && { finalizedHead: responseFinalizedHead }),
		}

	if (response.status === 409)
		return {
			resolution: SqdPortalResolution.Reorg,
			previousBlocks: SqdPortalReorg.assert(await response.json()).previousBlocks,
			...(responseFinalizedHead != null && { finalizedHead: responseFinalizedHead }),
		}

	if (!response.ok)
		throw new Error(await fetchFailedMessage('SQD Portal EVM block', response))

	const blocks = await ndjsonBlocks(response)
	const block = blocks.find((candidate) => candidate.header.number === numericBlockNumber)
	if (block == null)
		return {
			resolution: SqdPortalResolution.Partial,
			blocks,
			nextBlock: (blocks.at(-1)?.header.number ?? numericBlockNumber - 1) + 1,
			...(responseFinalizedHead != null && { finalizedHead: responseFinalizedHead }),
		}

	return {
		resolution: SqdPortalResolution.Complete,
		block,
		...(responseFinalizedHead != null && { finalizedHead: responseFinalizedHead }),
	}
}
