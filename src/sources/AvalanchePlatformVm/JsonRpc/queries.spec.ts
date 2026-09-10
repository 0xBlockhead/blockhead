import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/AvalanchePlatformVm/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	avalanchePlatformVmForBinding,
	getBalance,
	getBlock,
	getBlockByHeight,
	getCurrentValidators,
	getStake,
	getSubnets,
	getTx,
	getTxStatus,
	getUtxos,
} = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')

const binding = bindings[Source.AvalanchePlatformVm_JsonRpc][0]

beforeEach(() => {
	jsonRpc2.mockReset()
})

it('executes the query contract through public and local PlatformVM bindings', async () => {
	const platformBindings = bindings[Source.AvalanchePlatformVm_JsonRpc]
	expect(platformBindings).toHaveLength(2)
	jsonRpc2.mockResolvedValue({ height: '42' })

	for (const platformBinding of platformBindings)
		await expect(avalanchePlatformVmForBinding(platformBinding).getHeight()).resolves.toEqual({ height: '42' })

	expect(jsonRpc2.mock.calls.map(([usedBinding]) => usedBinding)).toEqual(platformBindings)
	expect(platformBindings.map(({ delivery }) => delivery)).toEqual(['HttpProxy', 'LocalOnly'])
})

it('uses official named parameters for exact account, stake, validator, subnet, and transaction reads', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			balance: '0',
			unlocked: '0',
			lockedStakeable: '0',
			lockedNotStakeable: '0',
			balances: {},
			unlockeds: {},
			lockedStakeables: {},
			lockedNotStakeables: {},
			utxoIDs: [],
		})
		.mockResolvedValueOnce({
			staked: '0',
			stakeds: {},
			stakedOutputs: [],
			encoding: 'hex',
		})
		.mockResolvedValueOnce({
			validators: [],
		})
		.mockResolvedValueOnce({
			status: 'Unknown',
		})
		.mockResolvedValueOnce({
			subnets: [{
				id: 'primary',
				controlKeys: [],
				threshold: '0',
			}],
		})

	await getBalance(['P-avax1account'])
	await getStake(['P-avax1account'], true)
	await getCurrentValidators({
		subnetID: 'primary',
		nodeIDs: ['NodeID-validator'],
	})
	await getTxStatus('transaction-id')
	await getSubnets({
		ids: ['primary'],
	})

	expect(jsonRpc2.mock.calls.map(([, method, params]) => [method, params])).toEqual([
		[
			'platform.getBalance',
			{
				addresses: ['P-avax1account'],
			},
		],
		[
			'platform.getStake',
			{
				addresses: ['P-avax1account'],
				validatorsOnly: true,
			},
		],
		[
			'platform.getCurrentValidators',
			{
				subnetID: 'primary',
				nodeIDs: ['NodeID-validator'],
			},
		],
		[
			'platform.getTxStatus',
			{
				txID: 'transaction-id',
			},
		],
		[
			'platform.getSubnets',
			{
				ids: ['primary'],
			},
		],
	])
})

it('bounds, deduplicates, and advances UTXOs by the opaque end index', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			numFetched: '3',
			utxos: [
				'0x01',
				'0x02',
				'0x02',
			],
			endIndex: {
				address: 'P-avax1account',
				utxo: 'opaque+/=1',
			},
			encoding: 'hex',
		})
		.mockResolvedValueOnce({
			numFetched: '1',
			utxos: [
				'0x03',
			],
			endIndex: {
				address: 'P-avax1account',
				utxo: 'opaque+/=2',
			},
			encoding: 'hex',
		})

	await expect(getUtxos(['P-avax1account'],
		3
	)).resolves.toEqual({
		utxos: [
			'0x01',
			'0x02',
			'0x03',
		],
		endIndex: {
			address: 'P-avax1account',
			utxo: 'opaque+/=2',
		},
		encoding: 'hex',
	})
	expect(jsonRpc2.mock.calls.map(([, , params]) => params)).toEqual([
		{
			addresses: ['P-avax1account'],
			limit: 3,
			encoding: 'hex',
		},
		{
			addresses: ['P-avax1account'],
			limit: 1,
			startIndex: {
				address: 'P-avax1account',
				utxo: 'opaque+/=1',
			},
			encoding: 'hex',
		},
	])
})

it('rejects invalid UTXO bounds before transport', async () => {
	await expect(getUtxos(['P-avax1account'],
		-1
	)).rejects.toThrow('UTXO limit must be a nonnegative safe integer')
	expect(jsonRpc2).not.toHaveBeenCalled()
})

it('fail-closes malformed validator and block envelopes', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			validators: [{
				nodeID: 'NodeID-x',
				weight: 1,
			}],
		})
		.mockResolvedValueOnce({
			block: {
				parentID: 'parent',
			},
			encoding: 'json',
		})

	await expect(getCurrentValidators(binding)).rejects.toThrow('invalid validators response envelope')
	await expect(getBlockByHeight(1n, 'json')).rejects.toThrow('invalid block by height response envelope')
})

it('projects json-encoded P-Chain blocks with transaction ids', async () => {
	jsonRpc2.mockResolvedValueOnce({
		block: {
			parentID: 'parent-block',
			height: 1,
			id: 'block-id',
			time: 1700000000,
			tx: {
				id: 'tx-id',
				unsignedTx: {
					time: 1600740000,
				},
			},
		},
		encoding: 'json',
	})

	await expect(getBlockByHeight(1n, 'json')).resolves.toEqual({
		block: {
			parentID: 'parent-block',
			height: 1,
			id: 'block-id',
			time: 1700000000,
			tx: {
				id: 'tx-id',
				unsignedTx: {
					time: 1600740000,
				},
			},
		},
		encoding: 'json',
	})
})

it('rejects substituted JSON block and transaction identities', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			block: {
				parentID: 'parent',
				height: 2,
				id: 'block-id',
			},
			encoding: 'json',
		})
		.mockResolvedValueOnce({
			block: {
				parentID: 'parent',
				height: 1,
				id: 'other-block',
			},
			encoding: 'json',
		})
		.mockResolvedValueOnce({
			tx: {
				id: 'other-tx',
				unsignedTx: {},
			},
			encoding: 'json',
		})

	await expect(getBlockByHeight(1n, 'json')).rejects.toThrow('block height response does not match request')
	await expect(getBlock('block-id', 'json')).rejects.toThrow('block response does not match request')
	await expect(getTx('tx-id', 'json')).rejects.toThrow('transaction response does not match request')
})

it('accepts json-encoded platform.getTx envelopes and fail-closes hex-shaped strings when json is expected downstream', async () => {
	jsonRpc2.mockResolvedValueOnce({
		tx: {
			unsignedTx: {
				networkID: 1,
				blockchainID: '11111111111111111111111111111111LpoYY',
				memo: '0x',
				validator: {
					nodeID: 'NodeID-a',
					start: 1,
					end: 2,
					weight: 3,
				},
				stake: [],
				shares: 200000,
			},
			id: 'tx-id',
		},
		encoding: 'json',
	})

	await expect(getTx('tx-id', 'json')).resolves.toMatchObject({
		encoding: 'json',
		tx: {
			id: 'tx-id',
			unsignedTx: {
				shares: 200000,
			},
		},
	})

	jsonRpc2.mockResolvedValueOnce({
		tx: {
			credentials: [],
		},
		encoding: 'json',
	})
	await expect(getTx('tx-id', 'json')).rejects.toThrow('invalid tx response envelope')

	await expect(getTx('', 'json')).rejects.toThrow('empty transaction id')
	expect(jsonRpc2).toHaveBeenCalledTimes(2)
})
