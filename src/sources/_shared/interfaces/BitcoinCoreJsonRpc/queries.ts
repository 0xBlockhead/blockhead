import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	BitcoinCoreBlock,
	BitcoinCoreTransaction,
} from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

export const bitcoinCoreJsonRpc = <
	_Block extends BitcoinCoreBlock = BitcoinCoreBlock,
>(binding: SourceBinding) => ({
	getBlock: <_Verbosity extends 0 | 1 | 2 = 2>({
		blockHash,
		verbosity,
	}: {
		blockHash: string
		verbosity?: _Verbosity
	}) => (
		jsonRpc2<_Verbosity extends 0 ? string : _Block>(
			binding,
			'getblock',
			[
				blockHash,
				verbosity ?? 2,
			]
		)
	),
	getRawTransaction: <_Verbose extends boolean = true>({
		txId,
		verbose,
	}: {
		txId: string
		verbose?: _Verbose
	}) => (
		jsonRpc2<_Verbose extends true ? BitcoinCoreTransaction : string>(
			binding,
			'getrawtransaction',
			[
				txId,
				verbose ?? true,
			]
		)
	),
})
