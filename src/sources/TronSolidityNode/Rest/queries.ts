import bindings from '$/sources/TronSolidityNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { tronNodeRest } from '$/sources/_shared/interfaces/TronNodeRest/queries.ts'

export const {
	getAccount,
	getBlockById,
	getTransactionById,
	getTransactionInfoById,
} = tronNodeRest({
	binding: bindings[Source.TronSolidityNode_Rest][0],
	endpointNamespace: 'walletsolidity',
})
