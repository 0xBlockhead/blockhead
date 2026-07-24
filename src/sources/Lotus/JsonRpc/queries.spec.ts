import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getActor,
	getIdAddress,
	getMinerActiveSectors,
	getMinerInfo,
	getMinerPower,
	getMinerSectorCount,
	getMinerSectors,
} from '$/sources/Lotus/JsonRpc/queries.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const fetchMock = vi.fn<typeof fetch>()

const lotusMainnetBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => (
		binding.source === Source.Lotus_JsonRpc
		&& binding.target.kind === SourceTargetKind.Caip2Network
		&& binding.target.key === 'fil:f'
	))

if (lotusMainnetBinding == null)
	throw new Error('Lotus JSON-RPC spec requires the canonical Filecoin mainnet binding')

const tipsetKey = [
	{
		'/': 'bafy2bzacehead',
	},
]

const rpcResponse = (result: unknown) => new Response(JSON.stringify({
	jsonrpc: '2.0',
	id: 1,
	result,
}), {
	headers: {
		'content-type': 'application/json',
	},
})

describe('Lotus JSON-RPC state queries', () => {
	beforeEach(() => {
		vi.stubGlobal('window', {})
		vi.stubGlobal('fetch', fetchMock)
		fetchMock.mockReset()
		fetchMock.mockImplementation(async () => rpcResponse({}))
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses one explicit tipset for actor, miner, sector, and count state', async () => {
		await getActor({
			binding: lotusMainnetBinding,
			address: 'f01234',
			tipsetKey,
		})
		await getIdAddress({
			binding: lotusMainnetBinding,
			address: 'f1robust',
			tipsetKey,
		})
		await getMinerInfo({
			binding: lotusMainnetBinding,
			minerAddress: 'f01234',
			tipsetKey,
		})
		await getMinerPower({
			binding: lotusMainnetBinding,
			minerAddress: 'f01234',
			tipsetKey,
		})
		await getMinerSectors({
			binding: lotusMainnetBinding,
			minerAddress: 'f01234',
			tipsetKey,
		})
		await getMinerActiveSectors({
			binding: lotusMainnetBinding,
			minerAddress: 'f01234',
			tipsetKey,
		})
		await getMinerSectorCount({
			binding: lotusMainnetBinding,
			minerAddress: 'f01234',
			tipsetKey,
		})

		expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(
			Array.from({ length: 7 }, () => 'https://api.node.glif.io/rpc/v1')
		)
		expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateGetActor',
				params: ['f01234', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateLookupID',
				params: ['f1robust', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerInfo',
				params: ['f01234', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerPower',
				params: ['f01234', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerSectors',
				params: ['f01234', null, tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerActiveSectors',
				params: ['f01234', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerSectorCount',
				params: ['f01234', tipsetKey],
			},
		])
	})
})
