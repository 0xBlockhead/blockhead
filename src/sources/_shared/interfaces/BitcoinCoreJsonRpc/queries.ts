import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	BitcoinCoreBlock,
	BitcoinCoreMempoolInfo,
	BitcoinCoreTransaction,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

export const bitcoinCoreJsonRpc = <
	_Block extends BitcoinCoreBlock = BitcoinCoreBlock,
	_Transaction = BitcoinCoreTransaction,
>(
	binding: SourceBinding,
	transactionObjectParameter: 1 | true
) => ({
	getBlock: ({
		blockHash,
	}: {
		blockHash: string
	}) => (
		jsonRpc2<_Block>(
			binding,
			'getblock',
			[
				blockHash,
				2,
			]
		)
	),
	getBlockHash: ({
		height,
	}: {
		height: bigint
	}) => (
		jsonRpc2<string>(
			binding,
			'getblockhash',
			[Number(height)]
		)
	),
	getMempoolInfo: () => (
		jsonRpc2<BitcoinCoreMempoolInfo>(
			binding,
			'getmempoolinfo',
			[]
		)
	),
	getRawTransaction: ({
		txId,
	}: {
		txId: string
	}) => (
		jsonRpc2<_Transaction>(
			binding,
			'getrawtransaction',
			[
				txId,
				transactionObjectParameter,
			]
		)
	),
})
