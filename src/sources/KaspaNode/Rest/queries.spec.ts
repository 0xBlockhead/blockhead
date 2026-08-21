import { describe, expect, it, vi } from 'vitest'

import * as httpRestClient from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/KaspaNode/bindings.ts'
import {
	getBlock,
	getServerInfo,
	getTransaction,
	getVirtualChain,
} from '$/sources/KaspaNode/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.KaspaNode_Rest][0]
const hash = 'a'.repeat(64)

describe('Kaspa node REST cold reads', () => {
	it('uses the node REST boundary and preserves transaction payload requests', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValueOnce({
			header: {},
			verboseData: {},
			transactions: [],
		})

		await getBlock({ blockHash: hash })

		expect(httpRestClient.getJson).toHaveBeenCalledWith(
			binding,
			`/blocks/${hash}?includeTransactions=true`
		)
	})

	it('forwards virtual-chain cursors and transport errors', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockRejectedValueOnce(new Error('upstream unavailable'))

		await expect(getVirtualChain({ startHash: hash, minConfirmationCount: 3 })).rejects.toThrow('upstream unavailable')
		expect(httpRestClient.getJson).toHaveBeenCalledWith(
			binding,
			`/info/virtual-chain-from-block/${hash}?min_confirmation_count=3`
		)
	})

	it('requests transaction inputs and outputs from the node', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValueOnce({ transactionId: hash, version: 1, inputs: [], outputs: [] })

		await getTransaction({ transactionId: hash })

		expect(httpRestClient.getJson).toHaveBeenCalledWith(
			binding,
			`/transactions/${hash}?inputs=true&outputs=true`
		)
	})

	it('rejects a malformed node identity envelope instead of emitting partial state', async () => {
		vi.spyOn(httpRestClient, 'getJson').mockResolvedValueOnce({ serverVersion: '', networkId: 'mainnet', isSynced: true, hasUtxoIndex: true })

		await expect(getServerInfo()).rejects.toThrow('KaspaNode_Rest: invalid server-info response envelope')
	})
})
