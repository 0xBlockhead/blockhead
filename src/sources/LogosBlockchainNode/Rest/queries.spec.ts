import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/LogosBlockchainNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')

const binding = bindings[Source.LogosBlockchainNode_Rest][0]

const lib = '2'.repeat(64)
const tip = '3'.repeat(64)
const address = 'a'.repeat(64)
const publicKey = `0x${address}`
const peerId = '12D3KooWLogosPeer'

describe('Logos Blockchain 0.2.0 node API', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it.each([
		'AwaitingStart',
		{
			Started: 'Bootstrapping',
		},
		{
			Started: 'Online',
		},
	])('reads the official chain-service response in mode %j', async (mode) => {
		getJson.mockResolvedValue({
			cryptarchia_info: {
				lib,
				lib_slot: 80_000,
				tip,
				slot: 100_000,
				height: 500,
			},
			mode,
		})

		await expect(queries.getCryptarchiaInfo()).resolves.toEqual({
			cryptarchia_info: {
				lib,
				lib_slot: 80_000,
				tip,
				slot: 100_000,
				height: 500,
			},
			mode,
		})
		expect(getJson).toHaveBeenCalledWith(binding, '/cryptarchia/info')
	})

	it('rejects the obsolete flattened documentation example', async () => {
		getJson.mockResolvedValue({
			lib,
			tip,
			slot: 70_899,
			height: 120,
			mode: 'Bootstrapping',
		})

		await expect(queries.getCryptarchiaInfo()).rejects.toThrow()
	})

	it.each([
		{
			field: 'lib',
			value: `0x${lib}`,
		},
		{
			field: 'slot',
			value: Number.MAX_SAFE_INTEGER + 1,
		},
	])('rejects invalid cryptarchia $field wire values', async ({ field, value }) => {
		getJson.mockResolvedValue({
			cryptarchia_info: {
				lib,
				lib_slot: 80_000,
				tip,
				slot: 100_000,
				height: 500,
				[field]: value,
			},
			mode: {
				Started: 'Online',
			},
		})

		await expect(queries.getCryptarchiaInfo()).rejects.toThrow()
	})

	it('reads libp2p network info with optional connected peers default', async () => {
		getJson.mockResolvedValue({
			listen_addresses: [
				'/ip4/127.0.0.1/tcp/3000',
				'/ip4/0.0.0.0/udp/3001/quic-v1',
			],
			peer_id: peerId,
			n_peers: 4,
			n_connections: 2,
			n_pending_connections: 1,
		})

		await expect(queries.getNetworkInfo()).resolves.toEqual({
			listen_addresses: [
				'/ip4/127.0.0.1/tcp/3000',
				'/ip4/0.0.0.0/udp/3001/quic-v1',
			],
			peer_id: peerId,
			n_peers: 4,
			n_connections: 2,
			n_pending_connections: 1,
		})
		expect(getJson).toHaveBeenCalledWith(binding, '/network/info')
	})

	it('rejects network info missing peer counts', async () => {
		getJson.mockResolvedValue({
			listen_addresses: ['/ip4/127.0.0.1/tcp/3000'],
			peer_id: peerId,
		})

		await expect(queries.getNetworkInfo()).rejects.toThrow()
	})

	it('reads wallet balance and strips 0x from the path key', async () => {
		getJson.mockResolvedValue({
			tip,
			balance: 1_000,
			notes: {
				[`${'b'.repeat(64)}`]: 250,
			},
			address,
		})

		await expect(queries.getWalletBalance(publicKey)).resolves.toEqual({
			tip,
			balance: 1_000,
			notes: {
				[`${'b'.repeat(64)}`]: 250,
			},
			address,
		})
		expect(getJson).toHaveBeenCalledWith(binding, `/wallet/${address}/balance`)
	})

	it('rejects wallet balance when tip is 0x-prefixed', async () => {
		getJson.mockResolvedValue({
			tip: `0x${tip}`,
			balance: 1,
			notes: {},
			address,
		})

		await expect(queries.getWalletBalance(publicKey)).rejects.toThrow()
	})

	it('rejects invalid zk public keys before transport', async () => {
		await expect(queries.getWalletBalance('0xabc')).rejects.toThrow('invalid zk public key')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('exposes the local node HTTP endpoint', () => {
		expect(queries.nodeEndpoint()).toBe('http://127.0.0.1:8080')
	})

	it('exports only the endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getCryptarchiaInfo',
			'getNetworkInfo',
			'getWalletBalance',
			'nodeEndpoint',
		].sort())
	})
})
