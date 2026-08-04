import { fetchFailedMessage } from '$/lib/http.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Sqd/bindings.ts'
import {
	SqdPortalEvmBlock,
	type SqdPortalEvmBlockRequest,
	SqdPortalReorg,
	SqdPortalResolution,
} from '$/sources/Sqd/Portal/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.SqdPortal_RawHttp][0]

const finalizedHead = (response: Response) => {
	const number = response.headers.get('x-sqd-finalized-head-number')
	const hash = response.headers.get('x-sqd-finalized-head-hash')
	if (number == null || hash == null)
		return undefined

	const parsedNumber = Number(number)
	if (!Number.isSafeInteger(parsedNumber) || parsedNumber < 0)
		throw new Error('SQD Portal returned a malformed finalized head number')

	return {
		number: parsedNumber,
		hash,
	}
}

const ndjsonBlocks = async (response: Response) => (
	(await response.text())
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line !== '')
		.map((line) => SqdPortalEvmBlock.assert(JSON.parse(line)))
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
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/stream`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(request),
		}
	)
	const responseFinalizedHead = finalizedHead(response)
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
