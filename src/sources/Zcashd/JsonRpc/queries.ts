import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { BitcoinCoreMempoolInfo } from '$/sources/BitcoinCore/JsonRpc/types.ts'
import type {
	ZcashBlock,
	ZcashTransaction,
	ZcashTreeState,
} from '$/sources/Zcashd/JsonRpc/types.ts'
import bindings from '$/sources/Zcashd/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Zcashd_JsonRpc][0]

export const getBlockHash = ({
	height,
}: {
	height: bigint
}) => {
	return jsonRpc2<string>(
		binding,
		'getblockhash',
		[Number(height)]
	)
}

export const getBlock = ({
	blockHash,
}: {
	blockHash: string
}) => {
	return jsonRpc2<ZcashBlock>(
		binding,
		'getblock',
		[
			blockHash,
			2,
		]
	)
}

export const getRawTransaction = ({
	txId,
}: {
	txId: string
}) => {
	return jsonRpc2<ZcashTransaction>(
		binding,
		'getrawtransaction',
		[
			txId,
			1,
		]
	)
}

export const getTreeState = ({
	block,
}: {
	block: string | number
}) => {
	return jsonRpc2<ZcashTreeState>(
		binding,
		'z_gettreestate',
		[block]
	)
}

export const getMempoolInfo = () => {
	return jsonRpc2<BitcoinCoreMempoolInfo>(
		binding,
		'getmempoolinfo',
		[]
	)
}
