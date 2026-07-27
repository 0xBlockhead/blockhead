import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	BitcoinCoreBlock,
	BitcoinCoreMempoolInfo,
	BitcoinCoreTransaction,
} from '$/sources/BitcoinCore/JsonRpc/types.ts'
import bindings from '$/sources/LitecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.LitecoinCore_JsonRpc]

export const getBlockHash = ({
	height,
}: {
	height: bigint
}) => (
	jsonRpc2<string>(
		binding,
		'getblockhash',
		[Number(height)]
	)
)

export const getBlock = <_Verbosity extends 0 | 1 | 2 = 2>({
	blockHash,
	verbosity,
}: {
	blockHash: string
	verbosity?: _Verbosity
}) => (
	jsonRpc2<_Verbosity extends 0 ? string : BitcoinCoreBlock>(
		binding,
		'getblock',
		[
			blockHash,
			verbosity ?? 2,
		]
	)
)

export const getRawTransaction = <_Verbose extends boolean = true>({
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
)

export const getMempoolInfo = () => (
	jsonRpc2<BitcoinCoreMempoolInfo>(
		binding,
		'getmempoolinfo',
		[]
	)
)
