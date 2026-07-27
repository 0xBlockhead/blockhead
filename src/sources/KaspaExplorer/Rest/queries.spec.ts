import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/KaspaExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	getAddressBalance,
	getAddressTransactionsPage,
	getCompleteAddressUtxos,
} from '$/sources/KaspaExplorer/Rest/queries.ts'
import * as httpRestClient from '$/sources/_shared/wire/HttpRest/client.ts'

const registeredBinding = bindings[Source.KaspaExplorer_Rest]

const binding = registeredBinding

const address = 'kaspa:qqkqkzjvr7zwxxmjxjkmxxdwju9kjs6e9u82uh59z07vgaks6gg62v8707g73'
const transactionId = 'a'.repeat(64)

describe('Kaspa Explorer address queries', () => {
	it('rejects checksum changes before transport', async () => {
		const getJson = vi.spyOn(httpRestClient, 'getJson')
		getJson.mockClear()

		await expect(getAddressBalance(
			`${address.slice(0, -1)}q`
		)).rejects.toThrow('invalid Kaspa mainnet address')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('preserves address identity and rejects an unsafe JSON balance', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValue({
			address,
			balance: Number.MAX_SAFE_INTEGER + 1,
		})

		await expect(getAddressBalance(address)).rejects.toThrow(
			'exceeds lossless JSON integer range'
		)
		expect(httpRestClient.getJson).toHaveBeenCalledWith(
			binding,
			`/addresses/${encodeURIComponent(address)}/balance`
		)
	})

	it('returns only a complete, unique, lossless UTXO snapshot', async () => {
		vi.spyOn(httpRestClient, 'getJson')
			.mockResolvedValueOnce([
				{
					address,
					outpoint: {
						transactionId,
						index: 0,
					},
					utxoEntry: {
						amount: '28700000000000000',
						scriptPublicKey: {
							scriptPublicKey: '20aa',
						},
						blockDaaScore: '12345678901234567',
						isCoinbase: false,
					},
				},
			])
			.mockResolvedValueOnce({
				count: 1,
			})

		await expect(getCompleteAddressUtxos(address)).resolves.toMatchObject([
			{
				utxoEntry: {
					amount: '28700000000000000',
					blockDaaScore: '12345678901234567',
				},
			},
		])
	})

	it('rejects the Explorer empty-list overload when its count proves truncation', async () => {
		vi.spyOn(httpRestClient, 'getJson')
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce({
				count: 501,
			})

		await expect(getCompleteAddressUtxos(address)).rejects.toThrow(
			'address UTXO response is incomplete'
		)
	})

	it('uses bounded time cursors and validates every transaction belongs to the address', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValue([
			{
				transaction_id: transactionId,
				mass: '12345678901234567',
				block_time: 1_720_000_000_000,
				inputs: [],
				outputs: [
					{
						amount: 1_000,
						script_public_key_address: address,
					},
				],
			},
		])

		await expect(getAddressTransactionsPage({
			address,
			limit: 25,
			before: 1_720_000_000_001,
		})).resolves.toHaveLength(1)
		expect(httpRestClient.getJson).toHaveBeenCalledWith(
			binding,
			`/addresses/${encodeURIComponent(address)}/full-transactions-page?limit=25&resolve_previous_outpoints=light&before=1720000000001`
		)
	})

	it('rejects unsafe transaction amounts and incompatible cursor directions', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValue([
			{
				transaction_id: transactionId,
				block_time: 1,
				outputs: [
					{
						amount: Number.MAX_SAFE_INTEGER + 1,
						script_public_key_address: address,
					},
				],
			},
		])

		await expect(getAddressTransactionsPage({
			address,
			limit: 1,
		})).rejects.toThrow('exceeds lossless JSON integer range')
		await expect(getAddressTransactionsPage({
			address,
			limit: 1,
			before: 2,
			after: 1,
		})).rejects.toThrow('cannot use both before and after')
	})
})
