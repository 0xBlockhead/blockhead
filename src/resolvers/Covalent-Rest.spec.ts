import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Covalent/bindings.ts'
import { Source } from '$/sources/Source.ts'
import transactionFixture from '$/sources/Covalent/GoldRush/Rest/fixtures/transaction.json'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceGetJson,
}))

const { default: covalentResolvers } = await import('$/resolvers/Covalent-Rest.ts')
const { goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')

const transactionResolver = covalentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmTransaction
	&& '$$logs' in resolver.projections
))
const ownedCoinsResolver = covalentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$ownedCoins' in resolver.projections
))
const accountTransactionsResolver = covalentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$transactions' in resolver.projections
))
const balanceResolver = covalentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkActorCoinBalance
))

if (
	transactionResolver == null
	|| ownedCoinsResolver == null
	|| accountTransactionsResolver == null
	|| balanceResolver == null
)
	throw new Error('Covalent-Rest spec missing core GoldRush resolvers')

const goldRushBinding = bindings[Source.GoldRushFoundational_Rest][0]
const address = '0x1111111111111111111111111111111111111111'
const tokenAddress = '0x2222222222222222222222222222222222222222'
const emptyContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const balanceEnvelope = {
	data: {
		address,
		chain_id: 1,
		chain_name: 'eth-mainnet',
		chain_tip_height: 22_900_000,
		chain_tip_signed_at: '2026-01-01T00:00:00.000Z',
		quote_currency: 'USD',
		updated_at: '2026-01-01T00:00:01.000Z',
		items: [
			{
				contract_decimals: 18,
				contract_name: 'Ether',
				contract_ticker_symbol: 'ETH',
				contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
				contract_display_name: 'Ether',
				supports_erc: [],
				last_transferred_at: null,
				block_height: 22_800_000,
				is_native_token: true,
				type: 'cryptocurrency',
				is_spam: false,
				balance: '1000000000000000000',
				balance_24h: null,
				quote_rate: 1,
				quote_rate_24h: 1,
				quote: 1,
				quote_24h: null,
				pretty_quote: '$1.00',
				pretty_quote_24h: null,
			},
			{
				contract_decimals: 6,
				contract_name: 'USD Coin',
				contract_ticker_symbol: 'USDC',
				contract_address: tokenAddress,
				contract_display_name: 'USD Coin',
				supports_erc: ['erc20'],
				last_transferred_at: '2025-12-31T00:00:00.000Z',
				block_height: 22_800_000,
				is_native_token: false,
				type: 'stablecoin',
				is_spam: false,
				balance: '2500000',
				balance_24h: '2500000',
				quote_rate: 1,
				quote_rate_24h: 1,
				quote: 2.5,
				quote_24h: 2.5,
				pretty_quote: '$2.50',
				pretty_quote_24h: '$2.50',
			},
		],
	},
	error: false,
	error_message: null,
	error_code: null,
}

describe('Covalent GoldRush product resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps approved chains and rejects unknown EIP-155 ids before transport', () => {
		expect(goldRushChainName(1)).toBe('eth-mainnet')
		expect(goldRushChainName(8453)).toBe('base-mainnet')
		expect(goldRushChainName(43114)).toBe('avalanche-mainnet')
		expect(() => goldRushChainName(999)).toThrow('unsupported chain 999')
	})

	it('maps transaction_v2 into schema-shaped EvmTransaction fields', async () => {
		sourceGetJson.mockResolvedValueOnce(transactionFixture)

		const resolved = await transactionResolver.resolve.EvmNetworkTxHash.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash: transactionFixture.data.items[0].tx_hash,
			},
			emptyContext
		)

		expect(resolved).toMatchObject({
			$block: {
				[EntityMetaKey.Selector]: {
					blockNumber: 22_900_000n,
				},
			},
			indexInBlock: 7,
			value: 1_000_000_000_000_000_000n,
			executionStatus: EvmTransactionExecutionStatus.Success,
			$$logs: [{
				[EntityMetaKey.Selector]: {
					indexInTransaction: 3,
				},
			}],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			goldRushBinding,
			`https://api.covalenthq.com/v1/eth-mainnet/transaction_v2/${transactionFixture.data.items[0].tx_hash}/?with-internal=true&with-state=true`
		)
	})

	it('lists owned coins from balances_v2 with native and ERC-20 selectors', async () => {
		sourceGetJson.mockResolvedValueOnce(balanceEnvelope)

		const snapshot = await ownedCoinsResolver.resolve.EvmNetworkEvmAccount.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				$actor: {
					address,
				},
			},
			emptyContext
		)
		expect(ownedCoinsResolver.projections.$$ownedCoins.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$actor: {
						address,
					},
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$actor: {
						address,
					},
					$contract: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: '1',
							},
						},
						address: tokenAddress,
					},
				},
			},
		])
		expect(ownedCoinsResolver.projections.$$ownedCoins.continuation?.(snapshot)).toEqual({
			operation: 'account-owned-coins',
			target: 'goldrush',
			terminal: true,
		})
	})

	it('paginates owned coins through balances_v2 offset continuation without dropping rows', async () => {
		if (typeof ownedCoinsResolver.projections.$$ownedCoins === 'function')
			throw new Error('GoldRush owned-coins continuation missing')

		sourceGetJson.mockResolvedValueOnce(balanceEnvelope)

		const firstPage = await ownedCoinsResolver.resolve.EvmNetworkEvmAccount.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				$actor: {
					address,
				},
			},
			{
				...emptyContext,
				pagination: {
					limit: 1,
				},
			}
		)
		expect(ownedCoinsResolver.projections.$$ownedCoins.select(firstPage)).toHaveLength(1)
		expect(ownedCoinsResolver.projections.$$ownedCoins.continuation?.(firstPage)).toEqual({
			operation: 'account-owned-coins',
			target: 'goldrush',
			terminal: false,
			token: '1',
		})

		sourceGetJson.mockResolvedValueOnce(balanceEnvelope)
		const secondPage = await ownedCoinsResolver.resolve.EvmNetworkEvmAccount.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				$actor: {
					address,
				},
			},
			{
				...emptyContext,
				pagination: {
					limit: 1,
				},
				providerContinuationToken: '1',
			}
		)
		expect(ownedCoinsResolver.projections.$$ownedCoins.select(secondPage)).toEqual([{
			[EntityMetaKey.Selector]: {
				$actor: {
					address,
				},
				$contract: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					address: tokenAddress,
				},
			},
		}])
		expect(ownedCoinsResolver.projections.$$ownedCoins.continuation?.(secondPage)).toEqual({
			operation: 'account-owned-coins',
			target: 'goldrush',
			terminal: true,
		})
	})

	it('resolves native and ERC-20 balance headers from balances_v2', async () => {
		sourceGetJson
			.mockResolvedValueOnce(balanceEnvelope)
			.mockResolvedValueOnce(balanceEnvelope)

		await expect(balanceResolver.resolve.EvmAccountNativeCoinInstance.resolve(
			{
				$actor: {
					address,
				},
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			},
			emptyContext
		)).resolves.toMatchObject({
			symbol: 'ETH',
			decimals: 18,
			$coinInstance: {
				[EntityMetaKey.Selector]: {
					type: CoinInstanceType.NativeCurrency,
				},
			},
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					timestampMs: Date.parse('2026-01-01T00:00:01.000Z'),
					source: Source.GoldRushFoundational_Rest,
				},
				balance: 1_000_000_000_000_000_000n,
				blockNumber: 22_800_000n,
				usdValue: 1,
				priceUsd: 1,
			}],
		})

		await expect(balanceResolver.resolve.EvmAccountErc20CoinInstance.resolve(
			{
				$actor: {
					address,
				},
				$contract: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					address: tokenAddress,
				},
			},
			emptyContext
		)).resolves.toMatchObject({
			symbol: 'USDC',
			decimals: 6,
			$coinInstance: {
				[EntityMetaKey.Selector]: {
					type: CoinInstanceType.Erc20Token,
				},
			},
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					timestampMs: Date.parse('2026-01-01T00:00:01.000Z'),
					source: Source.GoldRushFoundational_Rest,
				},
				balance: 2_500_000n,
				blockNumber: 22_800_000n,
				usdValue: 2.5,
				priceUsd: 1,
			}],
		})
	})

	it('projects singular balance observations and paginates account transactions', async () => {
		const balanceTimestampResolver = covalentResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmNetworkActorCoinBalance_Timestamp
		))
		if (balanceTimestampResolver == null)
			throw new Error('missing GoldRush balance timestamp resolver')

		sourceGetJson.mockResolvedValueOnce(balanceEnvelope)
		const observation = await balanceTimestampResolver.resolve.ActorCoinTimestampMsSource.resolve(
			{
				$actorCoin: {
					$actor: {
						address,
					},
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
				},
				timestampMs: Date.parse('2026-01-01T00:00:01.000Z'),
				source: Source.GoldRushFoundational_Rest,
			},
			emptyContext
		)
		expect(balanceTimestampResolver.projections.balance(observation)).toBe(1_000_000_000_000_000_000n)
		expect(balanceTimestampResolver.projections.blockNumber(observation)).toBe(22_800_000n)

		sourceGetJson.mockResolvedValueOnce({
			data: {
				address,
				updated_at: '2026-01-01T00:00:01.000Z',
				quote_currency: 'USD',
				chain_id: 1,
				chain_name: 'eth-mainnet',
				chain_tip_height: 22_900_000,
				chain_tip_signed_at: '2026-01-01T00:00:00.000Z',
				current_page: 1,
				links: {
					prev: 'https://api.covalenthq.com/v1/eth-mainnet/address/x/transactions_v3/page/0/',
					next: null,
				},
				items: transactionFixture.data.items,
			},
			error: false,
			error_message: null,
			error_code: null,
		})

		const page = await accountTransactionsResolver.resolve.EvmNetworkEvmAccount.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				$actor: {
					address,
				},
			},
			{
				...emptyContext,
				providerContinuationToken: '1',
			}
		)
		expect(accountTransactionsResolver.projections.$$transactions.select(page)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash: transactionFixture.data.items[0].tx_hash,
			},
		}])
		expect(accountTransactionsResolver.projections.$$transactions.continuation?.(page)).toEqual({
			operation: 'account-transactions',
			target: 'goldrush',
			terminal: true,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			goldRushBinding,
			`https://api.covalenthq.com/v1/eth-mainnet/address/${address}/transactions_v3/page/1/?no-logs=true&block-signed-at-asc=false`
		)
	})

	it('lists account transactions from transactions_v3 page 0', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				address,
				updated_at: '2026-01-01T00:00:01.000Z',
				quote_currency: 'USD',
				chain_id: 1,
				chain_name: 'eth-mainnet',
				chain_tip_height: 22_900_000,
				chain_tip_signed_at: '2026-01-01T00:00:00.000Z',
				current_page: 0,
				links: {
					prev: null,
					next: 'https://api.covalenthq.com/v1/eth-mainnet/address/x/transactions_v3/page/1/',
				},
				items: transactionFixture.data.items,
			},
			error: false,
			error_message: null,
			error_code: null,
		})

		const page = await accountTransactionsResolver.resolve.EvmNetworkEvmAccount.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				$actor: {
					address,
				},
			},
			emptyContext
		)
		expect(accountTransactionsResolver.projections.$$transactions.select(page)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash: transactionFixture.data.items[0].tx_hash,
			},
		}])
		expect(accountTransactionsResolver.projections.$$transactions.continuation?.(page)).toEqual({
			operation: 'account-transactions',
			target: 'goldrush',
			terminal: false,
			token: '1',
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			goldRushBinding,
			`https://api.covalenthq.com/v1/eth-mainnet/address/${address}/transactions_v3/page/0/?no-logs=true&block-signed-at-asc=false`
		)
	})

	it('hard-fails missing balance envelopes instead of soft-emptying', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: null,
			error: true,
			error_message: 'Invalid API key',
			error_code: 401,
		})

		await expect(ownedCoinsResolver.resolve.EvmNetworkEvmAccount.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				$actor: {
					address,
				},
			},
			emptyContext
		)).rejects.toThrow('Invalid API key')
	})

	it('rejects unsupported networks before HTTP', async () => {
		await expect(transactionResolver.resolve.EvmNetworkTxHash.resolve(
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999',
					},
				},
				txHash: transactionFixture.data.items[0].tx_hash,
			},
			emptyContext
		)).rejects.toThrow('unsupported chain 999')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})

describe('Covalent GoldRush product entity types', () => {
	it('registers transaction, log, internal transfer, account, balance, and observation resolvers for GoldRush', () => {
		expect(covalentResolvers.source).toBe(Source.GoldRushFoundational_Rest)
		expect(covalentResolvers.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.EvmTransaction,
			EntityType.EvmLog,
			EntityType.EvmInternalTransfer,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkActorCoinBalance,
			EntityType.EvmNetworkActorCoinBalance_Timestamp,
		])
	})
})
