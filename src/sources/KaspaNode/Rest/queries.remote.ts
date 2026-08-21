import { query } from '$app/server'
import { type } from 'arktype'

import {
	getAddressBalance as getAddressBalanceFromSource,
	getAddressUtxos as getAddressUtxosFromSource,
	getBlock as getBlockFromSource,
	getBlockDagInfo as getBlockDagInfoFromSource,
	getServerInfo as getServerInfoFromSource,
	getTransaction as getTransactionFromSource,
	getVirtualChain as getVirtualChainFromSource,
} from '$/sources/KaspaNode/Rest/queries.ts'

export const getBlockDagInfo = query(() => getBlockDagInfoFromSource())
export const getServerInfo = query(() => getServerInfoFromSource())
const addressInput = type({ address: 'string > 0' })
const blockInput = type({ blockHash: 'string > 0' })
const transactionInput = type({ transactionId: 'string > 0' })
const virtualChainInput = type({ startHash: 'string > 0', 'minConfirmationCount?': 'number >= 0' })

export const getAddressBalance = query(addressInput, (input) => getAddressBalanceFromSource(input))
export const getAddressUtxos = query(addressInput, (input) => getAddressUtxosFromSource(input))
export const getBlock = query(blockInput, (input) => getBlockFromSource(input))
export const getTransaction = query(transactionInput, (input) => getTransactionFromSource(input))
export const getVirtualChain = query(virtualChainInput, (input) => getVirtualChainFromSource(input))
