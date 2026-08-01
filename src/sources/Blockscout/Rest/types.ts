import type { components, paths } from '$/sources/Blockscout/OpenApi/openapi.d.ts'

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
export type BlockscoutBlockDetails = components['schemas']['BlockResponse']
export type BlockscoutTransaction = components['schemas']['TransactionResponse']
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
