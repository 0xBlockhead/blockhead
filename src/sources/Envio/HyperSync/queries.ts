import { fetchFailedMessage } from '$/lib/http.ts'
import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	EnvioHyperSyncBlockRangeResponse,
	type EnvioHyperSyncBlockRangeRequest,
	type EnvioHyperSyncRollbackGuard,
	EnvioHyperSyncHeightResponse,
	EnvioHyperSyncResolution,
} from '$/sources/Envio/HyperSync/types.ts'

const binding = bindings[Source.EnvioHyperSync_RawHttp][0]

export const getHeight = async () => {
	const response = await sourceFetch(
		binding,
		new URL('/height', firstHttpUrlForBinding(binding)).toString()
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage('Envio HyperSync height', response))

	return EnvioHyperSyncHeightResponse.assert(await response.json())
}

export const getEvmBlockRangePage = async ({
	fromBlock,
	toBlock,
	rollbackGuard,
}: {
	fromBlock: bigint
	toBlock: bigint
	rollbackGuard?: EnvioHyperSyncRollbackGuard
}) => {
	const numericFromBlock = Number(fromBlock)
	const numericToBlock = Number(toBlock)
	if (
		!Number.isSafeInteger(numericFromBlock)
		|| !Number.isSafeInteger(numericToBlock)
		|| numericFromBlock < 0
		|| numericToBlock <= numericFromBlock
	)
		throw new Error(`EnvioHyperSync_RawHttp: invalid block range [${fromBlock.toString()}, ${toBlock.toString()})`)

	const request = {
		from_block: numericFromBlock,
		to_block: numericToBlock,
		include_all_blocks: true,
		field_selection: {
			block: [
				'number',
				'hash',
				'parent_hash',
				'timestamp',
				'miner',
				'gas_used',
				'gas_limit',
				'base_fee_per_gas',
				'blob_gas_used',
				'excess_blob_gas',
			],
			transaction: [
				'block_number',
				'hash',
			],
		},
	} satisfies EnvioHyperSyncBlockRangeRequest
	const response = await sourceFetch(
		binding,
		new URL('/query', firstHttpUrlForBinding(binding)).toString(),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(request),
		}
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage('Envio HyperSync EVM block range', response))

	const page = EnvioHyperSyncBlockRangeResponse.assert(await response.json())
	return {
		...page,
		resolution: (
			rollbackGuard != null
			&& page.rollback_guard != null
			&& rollbackGuard.hash !== page.rollback_guard.first_parent_hash ?
				EnvioHyperSyncResolution.Reorg
			: page.data.blocks.length === 0
				&& page.archive_height != null
				&& page.archive_height >= numericToBlock - 1
				&& page.next_block >= numericToBlock ?
					EnvioHyperSyncResolution.Empty
			: page.data.blocks.length === 0
				|| page.next_block < numericToBlock ?
					EnvioHyperSyncResolution.Partial
			:
				EnvioHyperSyncResolution.Complete
		),
	}
}
