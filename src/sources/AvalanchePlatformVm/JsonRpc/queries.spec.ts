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
	getBalance,
	getCurrentValidators,
	getStake,
	getTxStatus,
	getUtxos,
} = await import('$/sources/AvalanchePlatformVm/JsonRpc/queries.ts')

const binding = bindings[Source.AvalanchePlatformVm_JsonRpc][0]

beforeEach(() => {
	jsonRpc2.mockReset()
})

it('uses official named parameters for exact account, stake, validator, and transaction reads', async () => {
	jsonRpc2.mockResolvedValue({})

	await getBalance(binding, ['P-avax1account'])
	await getStake(binding, ['P-avax1account'], true)
	await getCurrentValidators(binding, {
		subnetID: 'primary',
		nodeIDs: ['NodeID-validator'],
	})
	await getTxStatus(binding, 'transaction-id')

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
		binding,
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
		binding,
		['P-avax1account'],
		-1
	)).rejects.toThrow('UTXO limit must be a nonnegative safe integer')
	expect(jsonRpc2).not.toHaveBeenCalled()
})
