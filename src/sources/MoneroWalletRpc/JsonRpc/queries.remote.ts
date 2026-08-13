import { query } from '$app/server'
import { type } from 'arktype'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/MoneroWalletRpc/bindings.ts'
import {
	getAccounts as getAccountsFromClient,
	getAddress as getAddressFromClient,
	getBalance as getBalanceFromClient,
	getHeight as getHeightFromClient,
	getKeyStatus as getKeyStatusFromClient,
	getOutputs as getOutputsFromClient,
	getTransfers as getTransfersFromClient,
} from '$/sources/MoneroWalletRpc/JsonRpc/queries.ts'


const binding = bindings[Source.MoneroWalletRpc_JsonRpc][0]

export const getAccounts = query(() => getAccountsFromClient(binding))
export const getBalance = query(() => getBalanceFromClient(binding))
export const getHeight = query(() => getHeightFromClient(binding))
export const getKeyStatus = query(() => getKeyStatusFromClient(binding))
export const getOutputs = query(() => getOutputsFromClient(binding))
export const getTransfers = query(() => getTransfersFromClient(binding))
export const getAddress = query(
	type('number.integer >= 0'),
	(accountIndex) => getAddressFromClient(accountIndex, binding)
)
