import bindings from '$/sources/TronSolidityNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { tronNodeRest } from '$/sources/_shared/interfaces/TronNodeRest/queries.ts'

const binding = bindings[Source.TronSolidityNode_Rest][0]

export const {
	getAccount,
	getBlockByNumber,
	getTransactionById,
	getTransactionInfoById,
} = tronNodeRest({
	binding,
	endpointNamespace: 'walletsolidity',
})
