import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'
import type {
	ZcashBlock,
	ZcashTransaction,
	ZcashTreeState,
} from '$/sources/Zcashd/JsonRpc/types.ts'
import bindings from '$/sources/Zcashd/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Zcashd_JsonRpc][0]

export const {
	getBlock,
	getBlockHash,
	getMempoolInfo,
	getRawTransaction,
} = bitcoinCoreJsonRpc<
	ZcashBlock,
	ZcashTransaction
>(binding, 1)

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
