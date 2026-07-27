import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Celestia/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getBlobProof,
	getHeaderByHeight,
	getHeaderLocalHead,
	getHeaderNetworkHead,
	getHeaderSyncState,
} from '$/sources/Celestia/JsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2: vi.fn(),
}))

const binding = bindings[Source.Celestia_JsonRpc]

const jsonRpc2Mock = vi.mocked(jsonRpc2)
const hash = 'a'.repeat(64)
const parentHash = 'b'.repeat(64)
const namespace = `${'A'.repeat(39)}=`
const commitment = `${'B'.repeat(43)}=`

const headerWire = {
	header: {
		chain_id: 'celestia',
		height: '9007199254740993123',
		time: '2026-07-23T04:49:10Z',
		last_block_id: {
			hash: parentHash,
		},
		data_hash: hash,
		app_hash: parentHash,
		proposer_address: 'c'.repeat(40),
	},
	commit: {
		block_id: {
			hash,
		},
	},
}

describe('Celestia Node read-only JSON-RPC contracts', () => {
	beforeEach(() => {
		jsonRpc2Mock.mockReset()
	})

	it('preserves header height and exact chain identity', async () => {
		jsonRpc2Mock.mockResolvedValue(headerWire)
		await expect(getHeaderByHeight(
			binding,
			9_007_199_254_740_993_123n
		)).resolves.toMatchObject({
			chainId: 'celestia',
			height: 9_007_199_254_740_993_123n,
			hash,
			parentHash,
		})
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			binding,
			'header.GetByHeight',
			['9007199254740993123']
		)
	})

	it('distinguishes local, network, and sync-head observations', async () => {
		jsonRpc2Mock.mockResolvedValueOnce(headerWire)
		await getHeaderLocalHead(binding)
		expect(jsonRpc2Mock).toHaveBeenLastCalledWith(
			binding,
			'header.LocalHead',
			[]
		)

		jsonRpc2Mock.mockResolvedValueOnce(headerWire)
		await getHeaderNetworkHead(binding)
		expect(jsonRpc2Mock).toHaveBeenLastCalledWith(
			binding,
			'header.NetworkHead',
			[]
		)

		jsonRpc2Mock.mockResolvedValueOnce({
			from_height: '9007199254740993123',
			to_height: '9007199254740993999',
		})
		await expect(getHeaderSyncState(binding)).resolves.toEqual({
			fromHeight: 9_007_199_254_740_993_123n,
			toHeight: 9_007_199_254_740_993_999n,
		})
	})

	it('requests proof metadata without invoking blob.Get or blob.GetAll', async () => {
		jsonRpc2Mock.mockResolvedValue([
			{
				end: 8,
				nodes: [hash],
				is_max_namespace_ignored: true,
			},
		])

		await expect(getBlobProof({
			binding,
			height: 12_424_743n,
			namespace,
			commitment,
		})).resolves.toHaveLength(1)
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			binding,
			'blob.GetProof',
			[
				'12424743',
				namespace,
				commitment,
			]
		)
		expect(jsonRpc2Mock.mock.calls.flatMap(([, method]) => method)).not.toContain('blob.Get')
		expect(jsonRpc2Mock.mock.calls.flatMap(([, method]) => method)).not.toContain('blob.GetAll')
	})

	it.each([
		{
			height: 0n,
			namespace,
			commitment,
			message: 'positive unsigned 64-bit integer',
		},
		{
			height: 1n,
			namespace: 'short',
			commitment,
			message: 'invalid blob namespace',
		},
		{
			height: 1n,
			namespace,
			commitment: 'short',
			message: 'invalid blob commitment',
		},
	])('rejects malformed blob subject before transport', async ({
		height,
		namespace: candidateNamespace,
		commitment: candidateCommitment,
		message,
	}) => {
		await expect(getBlobProof({
			binding,
			height,
			namespace: candidateNamespace,
			commitment: candidateCommitment,
		})).rejects.toThrow(message)
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})

	it('rejects foreign header identity and substituted height', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			...headerWire,
			header: {
				...headerWire.header,
				chain_id: 'mocha-4',
			},
		})
		await expect(getHeaderLocalHead(binding)).rejects.toThrow('foreign chain header')

		jsonRpc2Mock.mockResolvedValueOnce({
			...headerWire,
			header: {
				...headerWire.header,
				height: '2',
			},
		})
		await expect(getHeaderByHeight(
			binding,
			1n
		)).rejects.toThrow('mismatched height')
	})
})
