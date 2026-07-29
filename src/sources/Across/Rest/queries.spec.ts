import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getDeposit,
	getDepositByTransaction,
	getDeposits,
	getDepositStatus,
	getSuggestedFees,
} = await import('$/sources/Across/Rest/queries.ts')

const binding = {
	source: Source.Across_Rest,
	target: {
		kind: SourceTargetKind.Global,
		key: 'across-api',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://app.across.to',
		origin: 'https://app.across.to',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{ scope: SourceCredentialScope.None }],
} as const satisfies SourceBinding

const depositor = '0xA4d353BBc130cbeF1811f27ac70989F9d568CeAB'
const recipient = '0xB4d353BBc130cbeF1811f27ac70989F9d568CeAB'
const inputToken = '0x4200000000000000000000000000000000000006'
const outputToken = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
const depositTxnRef = `0x${'1'.repeat(64)}`
const fillTxnRef = `0x${'2'.repeat(64)}`
const relayHash = `0x${'3'.repeat(64)}`
const depositId = '900719925474099312345'
const deposit = {
	id: 14_503_095,
	relayHash,
	depositId,
	originChainId: 8453,
	destinationChainId: 42161,
	depositor,
	recipient,
	inputToken,
	inputAmount: '900719925474099312345',
	outputToken,
	outputAmount: '900719925474099300000',
	message: '0x',
	messageHash: `0x${'0'.repeat(64)}`,
	exclusiveRelayer: '0xCad97616f91872C02BA3553dB315Db4015cBE850',
	exclusivityDeadline: null,
	fillDeadline: '2026-07-24T19:26:20.000Z',
	quoteTimestamp: '2026-07-24T16:07:11.000Z',
	depositBlockNumber: 33_292_078,
	depositBlockTimestamp: '2026-07-24T16:11:43.000Z',
	depositTxnRef,
	status: 'filled',
	depositRefundTxnRef: null,
	bridgeFeeUsd: '0.017884155707075979',
	fillGasFee: '2532354948000',
	fillGasFeeUsd: '0.009488583742324977',
	relayer: '0xCad97616f91872C02BA3553dB315Db4015cBE850',
	fillBlockNumber: 44_135_258,
	fillBlockTimestamp: '2026-07-24T16:12:03.000Z',
	fillTxnRef,
	speedups: [],
} as const

describe('Across public bridge observations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('preserves deposit, relay, fill, token, amount, fee, and lifecycle identity', async () => {
		sourceGetJson.mockResolvedValue({
			deposit,
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})

		await expect(getDeposit({
			binding,
			originChainId: 8453,
			depositId,
		})).resolves.toMatchObject({
			value: {
				deposit: {
					depositId,
					relayHash,
					depositTxnRef,
					fillTxnRef,
					inputAmount: '900719925474099312345',
					bridgeFeeUsd: '0.017884155707075979',
					status: 'filled',
				},
			},
			observedBy: 'Across_Rest',
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://app.across.to/api/deposit?originChainId=8453&depositId=${depositId}&index=0`
		)
	})

	it('distinguishes multiple deposits in one transaction by index', async () => {
		sourceGetJson.mockResolvedValue({
			deposit,
			pagination: {
				currentIndex: 2,
				maxIndex: 2,
			},
		})

		await getDepositByTransaction({
			binding,
			depositTxnRef,
			index: 2,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://app.across.to/api/deposit?depositTxnRef=${depositTxnRef}&index=2`
		)
	})

	it('tracks status by lossless origin-chain deposit identity', async () => {
		sourceGetJson.mockResolvedValue({
			status: 'filled',
			originChainId: 8453,
			depositId,
			depositTxnRef,
			fillTxnRef,
			destinationChainId: 42161,
			depositRefundTxnRef: null,
			actionsSucceeded: null,
			originToken: null,
			destinationToken: null,
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})

		await expect(getDepositStatus({
			binding,
			originChainId: 8453,
			depositId,
		})).resolves.toMatchObject({
			value: {
				status: 'filled',
				fillTxnRef,
			},
		})
	})

	it('bounds depositor pagination and rejects foreign rows', async () => {
		sourceGetJson.mockResolvedValue([deposit])
		await getDeposits({
			binding,
			depositor,
			limit: 1,
			skip: 100,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://app.across.to/api/deposits?depositor=${depositor}&limit=1&skip=100`
		)

		sourceGetJson.mockResolvedValue([{
			...deposit,
			depositor: recipient,
		}])
		await expect(getDeposits({
			binding,
			depositor,
		})).rejects.toThrow('foreign depositor deposit')
	})

	it('preserves quote amounts, fee percentages, limits, and route identity', async () => {
		sourceGetJson.mockResolvedValue({
			estimatedFillTimeSec: 2,
			capitalFeePct: '78750000000001',
			capitalFeeTotal: '78750000000001',
			relayGasFeePct: '155024308002',
			relayGasFeeTotal: '155024308002',
			relayFeePct: '78905024308003',
			relayFeeTotal: '78905024308003',
			lpFeePct: '0',
			timestamp: '1754342087',
			isAmountTooLow: false,
			quoteBlock: '900719925474099312345',
			exclusiveRelayer: depositor,
			exclusivityDeadline: 1_754_342_267,
			spokePoolAddress: depositor,
			destinationSpokePoolAddress: recipient,
			totalRelayFee: {
				pct: '78905024308003',
				total: '78905024308003',
			},
			relayerCapitalFee: {
				pct: '78750000000001',
				total: '78750000000001',
			},
			relayerGasFee: {
				pct: '155024308002',
				total: '155024308002',
			},
			lpFee: {
				pct: '0',
				total: '0',
			},
			limits: {
				minDeposit: '134862494200912',
				maxDeposit: '1661211802629989209324',
				maxDepositInstant: '231397155893653275446',
				maxDepositShortDelay: '1661211802629989209324',
				recommendedDepositInstant: '231397155893653275446',
			},
			fillDeadline: '1754353917',
			outputAmount: '999921094975691997',
			inputToken: {
				address: inputToken,
				symbol: 'ETH',
				decimals: 18,
				chainId: 8453,
			},
			outputToken: {
				address: outputToken,
				symbol: 'ETH',
				decimals: 18,
				chainId: 42161,
			},
			id: 'quote-1',
		})

		await expect(getSuggestedFees({
			binding,
			inputToken,
			outputToken,
			originChainId: 8453,
			destinationChainId: 42161,
			amount: '1000000000000000000',
		})).resolves.toMatchObject({
			value: {
				totalRelayFee: {
					pct: '78905024308003',
				},
				quoteBlock: '900719925474099312345',
			},
		})
	})

	it('rejects malformed identities, bounds, units, and impossible chronology', async () => {
		await expect(getDeposit({
			binding,
			originChainId: 8453,
			depositId: '9e18',
		})).rejects.toThrow('invalid deposit id')
		await expect(getDeposits({
			binding,
			depositor,
			limit: 101,
		})).rejects.toThrow('invalid page limit')

		sourceGetJson.mockResolvedValue({
			deposit: {
				...deposit,
				inputAmount: '1.5',
			},
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})
		await expect(getDeposit({
			binding,
			originChainId: 8453,
			depositId,
		})).rejects.toThrow('invalid input amount')

		sourceGetJson.mockResolvedValue({
			deposit: {
				...deposit,
				fillBlockTimestamp: '2026-07-24T16:10:00.000Z',
			},
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})
		await expect(getDeposit({
			binding,
			originChainId: 8453,
			depositId,
		})).rejects.toThrow('fill predates deposit')

		expect('query' in await import('$/sources/Across/Rest/queries.ts')).toBe(false)
	})
})
