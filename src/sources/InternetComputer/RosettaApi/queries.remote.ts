import { query } from '$app/server'
import { type } from 'arktype'

import {
	getAccountBalance as getAccountBalanceFromRosetta,
	getAccountTransactions as getAccountTransactionsFromRosetta,
	getBlock as getBlockFromRosetta,
	getNetworkOptions as getNetworkOptionsFromRosetta,
	getNetworkStatus as getNetworkStatusFromRosetta,
} from '$/sources/InternetComputer/RosettaApi/queries.ts'

const blockIdentifierInput = type({
	'hash?': 'string',
	'index?': 'number',
})

export const getNetworkStatus = query(() => getNetworkStatusFromRosetta())

export const getNetworkOptions = query(() => getNetworkOptionsFromRosetta())

export const getBlock = query(
	blockIdentifierInput,
	(input) => getBlockFromRosetta(input)
)

export const getAccountBalance = query(
	type('string'),
	(accountIdentifier) => getAccountBalanceFromRosetta(accountIdentifier)
)

export const getAccountTransactions = query(
	type({
		accountIdentifier: 'string',
		limit: 'number',
		'maxBlock?': 'number',
		'offset?': 'number',
	}),
	(input) => getAccountTransactionsFromRosetta(input)
)
