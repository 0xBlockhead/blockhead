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

const [
	transactionResolver,
	ownedCoinsResolver,
	accountTransactionsResolver,
	balanceResolver,
] = covalentResolvers.resolvers

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
			`https://api.covalenthq.com/v1/eth-mainnet/transaction_v2/${transactionFixture.data.items[0].tx_hash}/`
		)
	})

	it('lists owned coins from balances_v2 with native and ERC-20 selectors', async () => {
		sourceGetJson.mockResolvedValueOnce(balanceEnvelope)

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
		)).resolves.toEqual([
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
		})
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
					next: null,
				},
				items: transactionFixture.data.items,
			},
			error: false,
			error_message: null,
			error_code: null,
		})

		await expect(accountTransactionsResolver.resolve.EvmNetworkEvmAccount.resolve(
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
		)).resolves.toEqual([{
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
	it('registers transaction, account, and balance resolvers for GoldRush', () => {
		expect(covalentResolvers.source).toBe(Source.GoldRushFoundational_Rest)
		expect(covalentResolvers.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.EvmTransaction,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkAccount,
			EntityType.EvmNetworkActorCoinBalance,
		])
	})
})
