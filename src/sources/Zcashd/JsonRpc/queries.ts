import {
	getBlock as getBitcoinCoreBlock,
	getBlockHash as getBitcoinCoreBlockHash,
	getMempoolInfo as getBitcoinCoreMempoolInfo,
	getRawTransaction as getBitcoinCoreRawTransaction,
} from '$/sources/BitcoinCore/JsonRpc/queries.ts'
import type {
	ZcashBlock,
	ZcashTransaction,
} from '$/sources/Zcashd/JsonRpc/types.ts'

export const getBlockHash = ({
	rpcUrl,
	height,
}: {
	rpcUrl: string
	height: bigint
}) => (
	getBitcoinCoreBlockHash({
		rpcUrl,
		height,
	})
)

export const getBlock = async ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash: string
}): Promise<ZcashBlock> => (
	getBitcoinCoreBlock({
		rpcUrl,
		blockHash,
		verbosity: 2,
	})
)

export const getRawTransaction = async ({
	rpcUrl,
	txId,
}: {
	rpcUrl: string
	txId: string
}): Promise<ZcashTransaction> => (
	getBitcoinCoreRawTransaction({
		rpcUrl,
		txId,
		verbose: true,
	})
)

export const getMempoolInfo = ({ rpcUrl }: { rpcUrl: string }) => (
	getBitcoinCoreMempoolInfo({ rpcUrl })
)
