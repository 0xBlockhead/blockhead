import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Covalent/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import {
	getAddressTransactions,
	getTokenBalances,
} from '$/sources/Covalent/GoldRush/Rest/queries.ts'
import transactionFixture from '$/sources/Covalent/GoldRush/Rest/fixtures/transaction.json'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceGetJson: vi.fn(),
}))

const binding = bindings[Source.GoldRushFoundational_Rest]
const address = '0x1111111111111111111111111111111111111111'
const tokenAddress = '0x2222222222222222222222222222222222222222'
const data = {
	address,
	chain_id: 1,
	chain_name: 'eth-mainnet',
	chain_tip_height: 22_900_000,
	chain_tip_signed_at: '2026-01-01T00:00:00.000Z',
	quote_currency: 'USD',
	updated_at: '2026-01-01T00:00:01.000Z',
	items: [{
		contract_decimals: 18,
		contract_name: 'Token',
		contract_ticker_symbol: 'TOKEN',
		contract_address: tokenAddress,
		contract_display_name: 'Token',
		supports_erc: ['erc20'],
		last_transferred_at: '2025-12-31T00:00:00.000Z',
		block_height: 22_800_000,
		is_native_token: false,
		type: 'cryptocurrency',
		is_spam: false,
		balance: '900719925474099312345',
		balance_24h: '900719925474099300000',
		quote_rate: 1,
		quote_rate_24h: 1,
		quote: 900.1,
		quote_24h: 900,
		pretty_quote: '$900.10',
		pretty_quote_24h: '$900.00',
	}],
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('GoldRush account token balances', () => {
	it('preserves exact balances and snapshot provenance for one chain and account', async () => {
		vi.mocked(sourceGetJson).mockResolvedValueOnce({
			data,
			error: false,
			error_message: null,
			error_code: null,
		})

		await expect(getTokenBalances({
			chainId: 1,
			chainName: 'eth-mainnet',
			address,
		})).resolves.toMatchObject({
			address,
			chain_id: 1,
			chain_name: 'eth-mainnet',
			chain_tip_height: 22_900_000,
			items: [{
				balance: '900719925474099312345',
			}],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://api.covalenthq.com/v1/eth-mainnet/address/${address}/balances_v2/?no-spam=true`
		)
	})

	it('rejects foreign network and account identity', async () => {
		vi.mocked(sourceGetJson)
			.mockResolvedValueOnce({
				data: {
					...data,
					chain_id: 137,
				},
				error: false,
				error_message: null,
				error_code: null,
			})
			.mockResolvedValueOnce({
				data: {
					...data,
					address: tokenAddress,
				},
				error: false,
				error_message: null,
				error_code: null,
			})

		await expect(getTokenBalances({
			chainId: 1,
			chainName: 'eth-mainnet',
			address,
		})).rejects.toThrow('account identity does not match')
		await expect(getTokenBalances({
			chainId: 1,
			chainName: 'eth-mainnet',
			address,
		})).rejects.toThrow('account identity does not match')
	})

	it('rejects lossy balances and duplicate token identities', async () => {
		vi.mocked(sourceGetJson)
			.mockResolvedValueOnce({
				data: {
					...data,
					items: [{
						...data.items[0],
						balance: '1.5',
					}],
				},
				error: false,
				error_message: null,
				error_code: null,
			})
			.mockResolvedValueOnce({
				data: {
					...data,
					items: [
						data.items[0],
						data.items[0],
					],
				},
				error: false,
				error_message: null,
				error_code: null,
			})

		await expect(getTokenBalances({
			chainId: 1,
			chainName: 'eth-mainnet',
			address,
		})).rejects.toThrow('invalid token balance')
		await expect(getTokenBalances({
			chainId: 1,
			chainName: 'eth-mainnet',
			address,
		})).rejects.toThrow('duplicate token balances')
	})

	it('fails before transport for unsupported chains and malformed accounts', async () => {
		await expect(getTokenBalances({
			chainId: 1,
			chainName: 'eth-mainnet',
			address: 'vitalik.eth',
		})).rejects.toThrow('invalid account address')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('keeps account history page identity, order, and continuation provenance', async () => {
		vi.mocked(sourceGetJson).mockResolvedValueOnce({
			data: {
				address,
				updated_at: '2026-01-01T00:00:01.000Z',
				quote_currency: 'USD',
				chain_id: 1,
				chain_name: 'eth-mainnet',
				chain_tip_height: 22_900_000,
				chain_tip_signed_at: '2026-01-01T00:00:00.000Z',
				current_page: 2,
				links: {
					prev: 'https://api.covalenthq.com/page/1',
					next: 'https://api.covalenthq.com/page/3',
				},
				items: transactionFixture.data.items,
			},
			error: false,
			error_message: null,
			error_code: null,
		})

		await expect(getAddressTransactions({
			chainId: 1,
			chainName: 'eth-mainnet',
			address,
			page: 2,
			noLogs: true,
		})).resolves.toMatchObject({
			address,
			current_page: 2,
			links: {
				next: 'https://api.covalenthq.com/page/3',
			},
			items: [{
				value: '1000000000000000000',
			}],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://api.covalenthq.com/v1/eth-mainnet/address/${address}/transactions_v3/page/2/?no-logs=true&block-signed-at-asc=false`
		)
	})

	it('rejects mismatched and duplicate account-history pages', async () => {
		vi.mocked(sourceGetJson)
			.mockResolvedValueOnce({
				data: {
					address,
					updated_at: '2026-01-01T00:00:01.000Z',
					quote_currency: 'USD',
					chain_id: 1,
					chain_name: 'eth-mainnet',
					chain_tip_height: 22_900_000,
					chain_tip_signed_at: '2026-01-01T00:00:00.000Z',
					current_page: 3,
					links: {
						prev: null,
						next: null,
					},
					items: [],
				},
				error: false,
				error_message: null,
				error_code: null,
			})
			.mockResolvedValueOnce({
				data: {
					address,
					updated_at: '2026-01-01T00:00:01.000Z',
					quote_currency: 'USD',
					chain_id: 1,
					chain_name: 'eth-mainnet',
					chain_tip_height: 22_900_000,
					chain_tip_signed_at: '2026-01-01T00:00:00.000Z',
					current_page: 2,
					links: {
						prev: null,
						next: null,
					},
					items: [
						transactionFixture.data.items[0],
						transactionFixture.data.items[0],
					],
				},
				error: false,
				error_message: null,
				error_code: null,
			})

		await expect(getAddressTransactions({
			chainId: 1,
			chainName: 'eth-mainnet',
			address,
			page: 2,
		})).rejects.toThrow('page identity does not match')
		await expect(getAddressTransactions({
			chainId: 1,
			chainName: 'eth-mainnet',
			address,
			page: 2,
		})).rejects.toThrow('duplicate account transactions')
	})
})
