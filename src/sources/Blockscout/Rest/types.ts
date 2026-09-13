import { type as arktype } from 'arktype'

import type { components, paths } from '$/sources/Blockscout/OpenApi/openapi.d.ts'

const blockscoutAddressEnvelope = arktype({
	hash: 'string',
})

export const blockscoutBlockDetailEnvelope = arktype({
	hash: 'string',
	height: 'number',
	miner: blockscoutAddressEnvelope,
	parent_hash: 'string',
	timestamp: 'string',
	transactions_count: 'number',
	'gas_used?': 'string',
	'gas_limit?': 'string',
	'base_fee_per_gas?': 'string | null',
	'blob_gas_used?': 'string | null',
	'excess_blob_gas?': 'string | null',
})
export const blockscoutCursorEnvelope = arktype({
	'[string]': 'string | number | null',
})
export const blockscoutBlocksPageEnvelope = arktype({
	items: arktype({
		base_fee_per_gas: 'string | null',
		gas_limit: 'string',
		gas_used: 'string',
		hash: 'string',
		height: 'number',
		miner: blockscoutAddressEnvelope,
		parent_hash: 'string',
		timestamp: 'string',
		transactions_count: 'number',
	}).array(),
	'next_page_params?': blockscoutCursorEnvelope.or(arktype.null),
})
export const blockscoutSignedAuthorizationEnvelope = arktype({
	address_hash: 'string',
	authority: 'string',
	chain_id: 'number',
	nonce: 'string',
	r: 'string',
	s: 'string',
	v: 'number',
	'status?': '"ok" | "invalid_chain_id" | "invalid_signature" | "invalid_nonce" | null',
})
export const blockscoutTransactionEnvelope = arktype({
	from: blockscoutAddressEnvelope,
	gas_limit: 'string',
	hash: 'string',
	nonce: 'number',
	raw_input: 'string',
	to: blockscoutAddressEnvelope.or(arktype.null),
	value: 'string',
	'type?': 'number | null',
	'status?': '"ok" | "error" | null',
	'gas_used?': 'string | null',
	'gas_price?': 'string | null',
	'max_fee_per_gas?': 'string | null',
	'max_priority_fee_per_gas?': 'string | null',
	'max_fee_per_blob_gas?': 'string | null',
	'blob_gas_used?': 'string | null',
	'blob_versioned_hashes?': arktype('string').array().or(arktype.null),
	'block_number?': 'number | null',
	'position?': 'number | null',
	'created_contract?': blockscoutAddressEnvelope.or(arktype.null),
	'authorization_list?': blockscoutSignedAuthorizationEnvelope.array().or(arktype.null),
	'revert_reason?': arktype({
		'raw?': 'string | null',
	}).or(arktype({
		'method_call?': 'string | null',
		'method_id?': 'string | null',
		'parameters?': 'unknown[]',
	})).or(arktype.null),
})
export const blockscoutTransactionsPageEnvelope = arktype({
	items: blockscoutTransactionEnvelope.array(),
	'next_page_params?': blockscoutCursorEnvelope.or(arktype.null),
})
export const blockscoutRawTraceEnvelope = arktype({
	action: {
		from: 'string',
		gas: 'string',
		input: 'string',
		value: 'string',
		'callType?': '"call" | "callcode" | "delegatecall" | "staticcall"',
		'to?': 'string',
	},
	'result?': {
		gasUsed: 'string',
		output: 'string',
	},
	subtraces: 'number',
	traceAddress: 'number[]',
	'transactionHash?': 'string | null',
	type: '"call" | "create" | "create2" | "reward" | "selfdestruct" | "stop" | "invalid"',
}).array()
export const blockscoutTokenTransferEnvelope = arktype({
	from: blockscoutAddressEnvelope,
	log_index: 'number',
	to: blockscoutAddressEnvelope,
	token: {
		address_hash: 'string',
	},
	token_type: '"ERC-20" | "ERC-404" | "ERC-721" | "ERC-1155" | "ERC-7984"',
	total: 'object | null',
	transaction_hash: 'string',
})
export const blockscoutTokenTransfersPageEnvelope = arktype({
	items: blockscoutTokenTransferEnvelope.array(),
	'next_page_params?': blockscoutCursorEnvelope.or(arktype.null),
})
export const blockscoutTokenBalanceEnvelope = arktype({
	token: arktype({
		address_hash: 'string',
		'type?': 'string | null',
		'symbol?': 'string | null',
		'decimals?': 'string | null',
		'exchange_rate?': 'string | null',
		'name?': 'string | null',
		'icon_url?': 'string | null',
	}).or(arktype.null),
	'token_id?': 'string | null',
	value: 'string',
})
export const blockscoutTokenBalancesEnvelope = blockscoutTokenBalanceEnvelope.array()
export const blockscoutAddressTokensPageEnvelope = arktype({
	items: blockscoutTokenBalanceEnvelope.array(),
})
export const blockscoutCoinBalanceEnvelope = arktype({
	block_number: 'number',
	block_timestamp: 'string',
	value: 'string',
	'delta?': 'string',
	'transaction_hash?': 'string | null',
})
export const blockscoutCoinBalanceHistoryPageEnvelope = arktype({
	items: blockscoutCoinBalanceEnvelope.array(),
})
export const blockscoutStateChangeEnvelope = arktype({
	address: blockscoutAddressEnvelope,
	balance_after: 'string | null',
	balance_before: 'string | null',
	change: 'string | null',
	is_miner: 'boolean',
	token: arktype({
		address: 'string',
	}).or(arktype.null),
	'token_id?': 'string | null',
	type: '"coin" | "token"',
})
export const blockscoutTransactionStateChangesPageEnvelope = arktype({
	items: blockscoutStateChangeEnvelope.array(),
	'next_page_params?': arktype({
		'state_changes?': 'string | null',
		'items_count?': 'number',
	}).or(arktype.null),
})

type Response<_Path extends keyof paths> = paths[_Path] extends {
	get: {
		responses: {
			200: {
				content: {
					'application/json': infer _Response
				}
			}
		}
	}
} ? _Response : never
type WithTokenTransferItems<_Page> = Omit<_Page, 'items'> & {
	items: BlockscoutTokenTransfer[]
}

export type BlockscoutAddress = components['schemas']['Address']
export type BlockscoutAddressDetails = components['schemas']['AddressResponse']
export type BlockscoutAddressCounters = components['schemas']['AddressCounters']
// OpenAPI lists the variants independently; `token_type` is their wire discriminator.
export type BlockscoutTokenTransfer = Omit<
	components['schemas']['TokenTransfer'],
	'token_type' | 'total'
> & (
	| {
		token_type: 'ERC-721'
		total: components['schemas']['TotalERC721'] | null
	}
	| {
		token_type: 'ERC-1155'
		total: components['schemas']['TotalERC1155'] | null
	}
	| {
		token_type: 'ERC-7984'
		total: components['schemas']['TotalERC7984'] | null
	}
	| {
		token_type: 'ERC-20' | 'ERC-404'
		total: components['schemas']['Total'] | null
	}
)
export type BlockscoutInternalTransaction = components['schemas']['InternalTransaction']
export type BlockscoutBlock = components['schemas']['Block']
// Live Blockscout block/tx wires include EIP-4844 blob fields OpenAPI still omits.
export type BlockscoutBlockDetails = components['schemas']['BlockResponse'] & {
	blob_gas_used?: string | null
	excess_blob_gas?: string | null
}
export type BlockscoutTransaction = Omit<components['schemas']['TransactionResponse'], 'to'> & {
	to: components['schemas']['TransactionResponse']['to'] | null
	max_fee_per_blob_gas?: string | null
	blob_gas_used?: string | null
	blob_versioned_hashes?: string[] | null
}
export type BlockscoutRawTrace = Response<'/v2/transactions/{transaction_hash_param}/raw-trace'>
export type BlockscoutSmartContractForList = components['schemas']['SmartContractListItem']
export type BlockscoutSmartContract = components['schemas']['SmartContract']
export type BlockscoutTransactionLog = components['schemas']['Log']
export type BlockscoutErc4337Account = components['schemas']['Account']
export type BlockscoutErc4337Bundler = components['schemas']['Bundler']
export type BlockscoutErc4337Paymaster = components['schemas']['Paymaster']
export type BlockscoutErc4337AccountFactory = components['schemas']['Factory']
export type BlockscoutErc4337RegistryEntry =
	| BlockscoutErc4337Account
	| BlockscoutErc4337Bundler
	| BlockscoutErc4337Paymaster
	| BlockscoutErc4337AccountFactory
export type BlockscoutUserOperationListItem = components['schemas']['UserOperationInList']
export type BlockscoutUserOperationDetail = components['schemas']['UserOperation']
export type BlockscoutBlocksPage = Response<'/v2/blocks'>
export type BlockscoutBlockTransactionsPage = Response<'/v2/blocks/{block_hash_or_number_param}/transactions'>
export type BlockscoutTransactionsPage = Response<'/v2/transactions'>
export type BlockscoutAddressTransactionsPage = Response<'/v2/addresses/{address_hash_param}/transactions'>
export type BlockscoutAddressTokenTransfersPage = WithTokenTransferItems<Response<'/v2/addresses/{address_hash_param}/token-transfers'>>
export type BlockscoutTokenTransfersPage = WithTokenTransferItems<Response<'/v2/token-transfers'>>
export type BlockscoutTransactionTokenTransfersPage = WithTokenTransferItems<Response<'/v2/transactions/{transaction_hash_param}/token-transfers'>>
export type BlockscoutTokenBalance = components['schemas']['TokenBalance']
export type BlockscoutAddressTokenBalances = BlockscoutTokenBalance[]
export type BlockscoutAddressTokensPage = Response<'/v2/addresses/{address_hash_param}/tokens'>
export type BlockscoutCoinBalance = components['schemas']['CoinBalance']
export type BlockscoutCoinBalanceHistoryPage = Response<'/v2/addresses/{address_hash_param}/coin-balance-history'>
export type BlockscoutTransactionInternalTransactionsPage = Response<'/v2/transactions/{transaction_hash_param}/internal-transactions'>
export type BlockscoutAddressInternalTransactionsPage = Response<'/v2/addresses/{address_hash_param}/internal-transactions'>
// The schema documents these pagination keys but emits `Record<string, unknown>` for the response object.
export type BlockscoutTransactionLogsPage = Omit<
	Response<'/v2/transactions/{transaction_hash_param}/logs'>,
	'next_page_params'
> & {
	next_page_params: {
		index?: number
		block_number?: number
		items_count?: number
	} | null
}
// The upstream schema leaves state-change keyset cursor values as an untyped record.
export type BlockscoutTransactionStateChangesPage = Omit<
	Response<'/v2/transactions/{transaction_hash_param}/state-changes'>,
	'next_page_params'
> & {
	next_page_params: {
		state_changes?: string | null
		items_count?: number
	} | null
}
export type BlockscoutStateChange = components['schemas']['StateChange']
export type BlockscoutSmartContractsPage = Response<'/v2/smart-contracts/'>
export type BlockscoutUserOperationsPage = Response<'/v2/proxy/account-abstraction/operations'>
export type BlockscoutErc4337AccountsPage = Response<'/v2/proxy/account-abstraction/accounts'>
export type BlockscoutErc4337BundlersPage = Response<'/v2/proxy/account-abstraction/bundlers'>
export type BlockscoutErc4337PaymastersPage = Response<'/v2/proxy/account-abstraction/paymasters'>
export type BlockscoutErc4337FactoriesPage = Response<'/v2/proxy/account-abstraction/factories'>

// The upstream schema leaves the dynamic gas tier object untyped.
export type BlockscoutStats = Omit<components['schemas']['StatsResponse'], 'gas_prices'> & {
	gas_prices?: {
		slow?: number
		average?: number
		fast?: number
	} | null
}
