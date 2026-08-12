import { query } from '$app/server'
import { type } from 'arktype'

import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/MoneroWalletRpc/bindings.ts'
import {
	getAccounts as getAccountsFromClient,
	getAddress as getAddressFromClient,
	getBalance as getBalanceFromClient,
	getHeight as getHeightFromClient,
	getOutputs as getOutputsFromClient,
	getTransfers as getTransfersFromClient,
} from '$/sources/MoneroWalletRpc/JsonRpc/queries.ts'


const binding = bindings[Source.MoneroWalletRpc_JsonRpc][0]

const accountsRemote = query(() => getAccountsFromClient(binding))
const balanceRemote = query(() => getBalanceFromClient(binding))
const heightRemote = query(() => getHeightFromClient(binding))
const outputsRemote = query(() => getOutputsFromClient(binding))
const transfersRemote = query(() => getTransfersFromClient(binding))
const addressRemote = query(
	type('number.integer >= 0'),
	(accountIndex) => getAddressFromClient(binding, accountIndex)
)

export const getAccounts = (_binding: SourceBinding) => accountsRemote()
export const getBalance = (_binding: SourceBinding) => balanceRemote()
export const getHeight = (_binding: SourceBinding) => heightRemote()
export const getOutputs = (_binding: SourceBinding) => outputsRemote()
export const getTransfers = (_binding: SourceBinding) => transfersRemote()
export const getAddress = (_binding: SourceBinding, accountIndex: number) => addressRemote(accountIndex)
