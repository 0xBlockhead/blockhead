import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	BitcoinCoreBlock,
	BitcoinCoreTransaction,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

export const bitcoinCoreJsonRpc = <
	_Block extends BitcoinCoreBlock = BitcoinCoreBlock,
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
	getRawTransaction: ({
		txId,
	}: {
		txId: string
	}) => (
		jsonRpc2<BitcoinCoreTransaction>(
			binding,
			'getrawtransaction',
			[
				txId,
				transactionObjectParameter,
			]
		)
	),
})
