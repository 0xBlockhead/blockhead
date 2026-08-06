import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getBalance,
	getBlockByHeight,
	getCurrentValidators,
	getStake,
	getSubnets,
	getTxStatus,
	getUtxos,
} = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')

beforeEach(() => {
	jsonRpc2.mockReset()
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

	await expect(getUtxos(
		['P-avax1account'],
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
	await expect(getUtxos(
		['P-avax1account'],
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

	await expect(getCurrentValidators()).rejects.toThrow('invalid validators response envelope')
	await expect(getBlockByHeight(1n, 'json')).rejects.toThrow('invalid block by height response envelope')
})

it('projects json-encoded P-Chain blocks with transaction ids', async () => {
	jsonRpc2.mockResolvedValueOnce({
		block: {
			parentID: 'parent-block',
			height: 1,
			id: 'block-id',
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
