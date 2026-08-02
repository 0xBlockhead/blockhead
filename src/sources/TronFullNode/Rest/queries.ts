import bindings from '$/sources/TronFullNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { tronNodeRest } from '$/sources/_shared/interfaces/TronNodeRest/queries.ts'

const binding = bindings[Source.TronFullNode_Rest][0]

export const {
	getAccount,
	getBlockById,
	getTransactionById,
	getTransactionInfoById,
} = tronNodeRest({
	binding,
	endpointNamespace: 'wallet',
})
