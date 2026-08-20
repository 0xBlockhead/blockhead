import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Ogmios/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getConstitution,
	getEpoch,
	getLedgerTip,
	getNetworkBlockHeight,
	getNetworkTip,
	getProtocolParameters,
} = await import('$/sources/Ogmios/JsonRpc/queries.ts')

const tipPoint = {
	slot: 130_000_102,
	id: 'c248757d390181c517a5beadc9c3fe64bf821d3e889a963fc717003ec248757d',
} as const

const protocolParameters = {
	minFeeCoefficient: 44,
	minFeeConstant: {
		ada: {
			lovelace: 155_381,
		},
	},
	minUtxoDepositCoefficient: 4_310,
	minUtxoDepositConstant: {
		ada: {
			lovelace: 0,
		},
	},
	maxBlockBodySize: {
		bytes: 90_112,
	},
	maxBlockHeaderSize: {
		bytes: 1_100,
	},
	maxTransactionSize: {
		bytes: 16_384,
	},
	maxValueSize: {
		bytes: 5_000,
	},
	stakeCredentialDeposit: {
		ada: {
			lovelace: 2_000_000,
		},
	},
	stakePoolDeposit: {
		ada: {
			lovelace: 500_000_000,
		},
	},
	stakePoolRetirementEpochBound: 18,
	stakePoolPledgeInfluence: '3/10',
	minStakePoolCost: {
		ada: {
			lovelace: 340_000_000,
		},
	},
	monetaryExpansion: '3/1000',
	treasuryExpansion: '1/5',
	desiredNumberOfStakePools: 500,
	federatedBlockProductionRatio: '0/1',
	collateralPercentage: 150,
	maxCollateralInputs: 3,
	plutusCostModels: {
		'plutus:v3': [
			1,
			2,
			3,
		],
	},
	scriptExecutionPrices: {
		memory: '577/10000',
		cpu: '721/10000000',
	},
	maxExecutionUnitsPerTransaction: {
		memory: 14_000_000,
		cpu: 10_000_000_000,
	},
	maxExecutionUnitsPerBlock: {
		memory: 62_000_000,
		cpu: 20_000_000_000,
	},
	version: {
		major: 9,
		minor: 0,
	},
} as const

describe('Ogmios JsonRpc tip transport', () => {
	it('accepts ledger tip / network tip / block height / epoch / protocol parameters', async () => {
		jsonRpc2
			.mockResolvedValueOnce(tipPoint)
			.mockResolvedValueOnce(tipPoint)
			.mockResolvedValueOnce(12_345_678)
			.mockResolvedValueOnce(500)
			.mockResolvedValueOnce({
				metadata: {
					url: 'ipfs://constitution',
					hash: 'constitution-anchor-hash',
				},
				guardrails: {
					hash: 'guardrails-script-hash',
				},
			})
			.mockResolvedValueOnce(protocolParameters)

		await expect(getLedgerTip()).resolves.toEqual(tipPoint)
		await expect(getNetworkTip()).resolves.toEqual(tipPoint)
		await expect(getNetworkBlockHeight()).resolves.toBe(12_345_678)
		await expect(getEpoch()).resolves.toBe(500)
		await expect(getConstitution()).resolves.toEqual({
			metadata: {
				url: 'ipfs://constitution',
				hash: 'constitution-anchor-hash',
			},
			guardrails: {
				hash: 'guardrails-script-hash',
			},
		})
		await expect(getProtocolParameters()).resolves.toMatchObject({
			minFeeCoefficient: 44,
			version: {
				major: 9,
			},
		})

		expect(jsonRpc2).toHaveBeenNthCalledWith(
			1,
			bindings[Source.Ogmios_JsonRpc][0],
			'queryLedgerState/tip'
		)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			2,
			bindings[Source.Ogmios_JsonRpc][0],
			'queryNetwork/tip'
		)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			3,
			bindings[Source.Ogmios_JsonRpc][0],
			'queryNetwork/blockHeight'
		)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			4,
			bindings[Source.Ogmios_JsonRpc][0],
			'queryLedgerState/epoch'
		)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			5,
			bindings[Source.Ogmios_JsonRpc][0],
			'queryLedgerState/constitution'
		)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			6,
			bindings[Source.Ogmios_JsonRpc][0],
			'queryLedgerState/protocolParameters'
		)
	})

	it('rejects origin tips and malformed envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce('origin')
		await expect(getLedgerTip()).rejects.toThrow('ledger tip is origin')

		jsonRpc2.mockResolvedValueOnce({
			slot: -1,
			id: tipPoint.id,
		})
		await expect(getNetworkTip()).rejects.toThrow('invalid network tip response envelope')

		jsonRpc2.mockResolvedValueOnce('origin')
		await expect(getNetworkBlockHeight()).rejects.toThrow('block height is origin')

		jsonRpc2.mockResolvedValueOnce({
			minFeeCoefficient: 44,
		})
		await expect(getProtocolParameters()).rejects.toThrow('invalid protocol parameters response envelope')

		jsonRpc2.mockResolvedValueOnce({
			metadata: {
				url: '',
				hash: 'constitution-anchor-hash',
			},
			guardrails: null,
		})
		await expect(getConstitution()).rejects.toThrow('invalid constitution response envelope')
	})
})
