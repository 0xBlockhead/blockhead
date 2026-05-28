import {
	getBlock as getBitcoinCoreBlock,
	getBlockHash as getBitcoinCoreBlockHash,
	getMempoolInfo as getBitcoinCoreMempoolInfo,
	getRawTransaction as getBitcoinCoreRawTransaction,
} from '$/sources/BitcoinCore/JsonRpc/queries.ts'

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

export const getBlock = ({
	rpcUrl,
	blockHash,
	verbosity = 2,
}: {
	rpcUrl: string
	blockHash: string
	verbosity?: 0 | 1 | 2
}) => (
	getBitcoinCoreBlock({
		rpcUrl,
		blockHash,
		verbosity,
	})
)

export const getRawTransaction = ({
	rpcUrl,
	txId,
	verbose = true,
}: {
	rpcUrl: string
	txId: string
	verbose?: boolean
}) => (
	getBitcoinCoreRawTransaction({
		rpcUrl,
		txId,
		verbose,
	})
)

export const getMempoolInfo = ({ rpcUrl }: { rpcUrl: string }) => (
	getBitcoinCoreMempoolInfo({ rpcUrl })
)
