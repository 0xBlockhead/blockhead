import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/EigenExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	getAvs,
	getOperator,
	getOperatorRewardInfo,
	getStrategyTvl,
	listAvss,
	listAvsAllocations,
	listAvsOperators,
	listAvsSlashes,
	listOperatorAllocations,
	listOperators,
	listOperatorSlashes,
	listStrategies,
	getStaker,
	getStakerDeposits,
	getStakerWithdrawals,
} from '$/sources/EigenExplorer/Rest/queries.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.eigenexplorer.test',
	sourceFetch: vi.fn(),
}))

const binding = bindings[Source.EigenExplorer_Rest][0]

const stakerAddress = '0x1111111111111111111111111111111111111111'
const operatorAddress = '0x2222222222222222222222222222222222222222'
const avsAddress = '0x7777777777777777777777777777777777777777'
const strategyAddress = '0x3333333333333333333333333333333333333333'
const tokenAddress = '0x4444444444444444444444444444444444444444'
const transactionHash = `0x${'5'.repeat(64)}`
const withdrawalRoot = `0x${'6'.repeat(64)}`

const respond = (
	body: unknown,
	init?: ResponseInit
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(
		new Response(
			body == null ?
				null
			:
				JSON.stringify(body),
			{
				headers: {
					'content-type': 'application/json',
				},
				...init,
			}
		)
	)
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('EigenExplorer REST queries', () => {
	it('uses binding-driven transport and validates exact staker shares', async () => {
		respond({
			address: stakerAddress,
			operatorAddress,
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [{
				strategyAddress,
				shares: '900719925474099312345',
			}],
		})

		await expect(getStaker(
			stakerAddress
		)).resolves.toMatchObject({
			address: stakerAddress,
			shares: [{
				shares: '900719925474099312345',
			}],
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://api.eigenexplorer.test/stakers/${stakerAddress}`,
			{
				headers: {
					accept: 'application/json',
				},
			}
		)
	})

	it('keeps deposits bounded, lossless, and subject-scoped', async () => {
		respond({
			data: [{
				transactionHash,
				stakerAddress,
				tokenAddress,
				strategyAddress,
				shares: '900719925474099312345',
				createdAtBlock: 100,
				createdAt: '2026-01-01T00:00:00.000Z',
			}],
			meta: {
				total: 1,
				skip: 10,
				take: 25,
			},
		})

		await expect(getStakerDeposits(
			stakerAddress,
			{
				skip: 10,
				take: 25,
			}
		)).resolves.toMatchObject({
			data: [{
				shares: '900719925474099312345',
			}],
		})
		expect(vi.mocked(sourceFetch).mock.calls[0]?.[1]).toBe(
			`https://api.eigenexplorer.test/stakers/${stakerAddress}/deposits?skip=10&take=25`
		)

		respond({
			data: [{
				transactionHash,
				stakerAddress: operatorAddress,
				tokenAddress,
				strategyAddress,
				shares: '1',
				createdAtBlock: 100,
				createdAt: '2026-01-01T00:00:00.000Z',
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		await expect(getStakerDeposits(
			stakerAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: foreign deposit`)
	})

	it('validates withdrawal identity and nested strategy shares', async () => {
		respond({
			data: [{
				withdrawalRoot,
				nonce: 7,
				stakerAddress,
				delegatedTo: operatorAddress,
				withdrawerAddress: stakerAddress,
				shares: [{
					strategyAddress,
					shares: '42',
				}],
				createdAtBlock: 100,
				createdAt: '2026-01-01T00:00:00.000Z',
				updatedAtBlock: 101,
				updatedAt: '2026-01-02T00:00:00.000Z',
				isCompleted: false,
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 1,
			},
		})

		await expect(getStakerWithdrawals(
			stakerAddress,
			{
				take: 1,
			}
		)).resolves.toMatchObject({
			data: [{
				withdrawalRoot,
				nonce: 7,
			}],
		})
	})

	it('validates operator metadata and hard-fails non-OK HTTP', async () => {
		respond({
			address: operatorAddress,
			metadataName: 'Example Operator',
			metadataDescription: 'Restaking operator',
			metadataWebsite: 'https://example.operator',
			metadataLogo: 'https://example.operator/logo.svg',
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [{
				strategyAddress,
				shares: '42',
			}],
		})

		await expect(getOperator(
			operatorAddress
		)).resolves.toMatchObject({
			address: operatorAddress,
			metadataName: 'Example Operator',
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://api.eigenexplorer.test/operators/${operatorAddress}`,
			{
				headers: {
					accept: 'application/json',
				},
			}
		)

		respond(null, {
			status: 404,
			statusText: 'Not Found',
		})
		await expect(getOperator(
			operatorAddress
		)).rejects.toThrow(/EigenExplorer_Rest \/operators\//)
	})

	it('validates AVS metadata and operator list pagination', async () => {
		respond({
			address: avsAddress,
			metadataName: 'Example AVS',
			metadataDescription: 'Restaking AVS',
			metadataWebsite: 'https://example.avs',
			metadataLogo: 'https://example.avs/logo.svg',
			totalStakers: 12,
			totalOperators: 3,
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [{
				strategyAddress,
				shares: '42',
			}],
		})

		await expect(getAvs(
			avsAddress
		)).resolves.toMatchObject({
			address: avsAddress,
			totalOperators: 3,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://api.eigenexplorer.test/avs/${avsAddress}`,
			{
				headers: {
					accept: 'application/json',
				},
			}
		)

		respond({
			data: [{
				address: operatorAddress,
				metadataName: 'Example Operator',
				metadataDescription: null,
				metadataWebsite: null,
				metadataLogo: null,
				createdAtBlock: '100',
				updatedAtBlock: '101',
				createdAt: '2026-01-01T00:00:00.000Z',
				updatedAt: '2026-01-02T00:00:00.000Z',
				shares: [{
					strategyAddress,
					shares: '42',
				}],
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 25,
			},
		})

		await expect(listAvsOperators(
			avsAddress,
			{
				take: 25,
			}
		)).resolves.toMatchObject({
			data: [{
				address: operatorAddress,
			}],
		})
		expect(vi.mocked(sourceFetch).mock.calls.at(-1)?.[1]).toBe(
			`https://api.eigenexplorer.test/avs/${avsAddress}/operators?skip=0&take=25`
		)

		respond(null, {
			status: 404,
			statusText: 'Not Found',
		})
		await expect(getAvs(
			avsAddress
		)).rejects.toThrow(/EigenExplorer_Rest \/avs\//)
	})

	it('rejects duplicate operator reward metadata and invalid pagination', async () => {
		respond({
			address: operatorAddress,
			rewardTokens: [
				tokenAddress,
				tokenAddress.toUpperCase(),
			],
			rewardStrategies: [strategyAddress],
		})

		await expect(getOperatorRewardInfo(
			operatorAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: duplicate reward information`)
		await expect(getStakerDeposits(
			stakerAddress,
			{
				take: 101,
			}
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: take must be between 1 and 100`)
		expect(sourceFetch).toHaveBeenCalledTimes(1)
	})

	it('fail-closes on malformed list and detail response envelopes', async () => {
		respond({
			address: stakerAddress,
		})
		await expect(getStaker(
			stakerAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid staker response envelope`)

		respond({
			data: [{
				transactionHash,
				stakerAddress,
				tokenAddress,
				strategyAddress,
				shares: '1',
				createdAtBlock: 100,
				createdAt: '2026-01-01T00:00:00.000Z',
			}],
		})
		await expect(getStakerDeposits(
			stakerAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid staker deposits response envelope`)

		respond({
			data: 'not-an-array',
			meta: {
				total: 0,
				skip: 0,
				take: 100,
			},
		})
		await expect(getStakerWithdrawals(
			stakerAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid staker withdrawals response envelope`)

		respond({
			address: operatorAddress,
			metadataName: 'Example Operator',
		})
		await expect(getOperator(
			operatorAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid operator response envelope`)

		respond({
			address: operatorAddress,
			rewardTokens: tokenAddress,
			rewardStrategies: [strategyAddress],
		})
		await expect(getOperatorRewardInfo(
			operatorAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid operator rewards response envelope`)

		respond({
			address: avsAddress,
			metadataName: 'Example AVS',
			totalStakers: 12,
		})
		await expect(getAvs(
			avsAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid AVS response envelope`)

		respond({
			data: [{
				address: operatorAddress,
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 25,
			},
		})
		await expect(listAvsOperators(
			avsAddress,
			{
				take: 25,
			}
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid AVS operators response envelope`)
	})

	it('validates operator and AVS allocation pages with subject scoping', async () => {
		const allocation = {
			avsAddress,
			operatorSetId: 0,
			operatorAddress,
			strategyAddress,
			magnitude: '100000',
			effectBlock: 3326552,
			createdAt: '2025-02-01T00:00:00.000Z',
			createdAtBlock: 3325343,
			updatedAt: '2025-02-01T00:00:00.000Z',
			updatedAtBlock: 3325343,
		}

		respond({
			data: [allocation],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		await expect(listOperatorAllocations(
			operatorAddress
		)).resolves.toMatchObject({
			data: [allocation],
			meta: {
				total: 1,
			},
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://api.eigenexplorer.test/operators/${operatorAddress}/allocations?skip=0&take=100`,
			{
				headers: {
					accept: 'application/json',
				},
			}
		)

		respond({
			data: [{
				...allocation,
				operatorAddress: stakerAddress,
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		await expect(listOperatorAllocations(
			operatorAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: foreign allocation operator`)

		respond({
			data: [allocation],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		await expect(listAvsAllocations(
			avsAddress
		)).resolves.toMatchObject({
			data: [allocation],
		})
	})

	it('validates slash pages and strategy TVL envelopes', async () => {
		const slash = {
			avsAddress,
			operatorSetId: 0,
			operatorAddress,
			strategies: [strategyAddress],
			wadSlashed: ['900719925474099312345'],
			description: 'temp',
			createdAt: '2025-02-01T00:00:00.000Z',
			createdAtBlock: 3325343,
			updatedAt: '2025-02-01T00:00:00.000Z',
			updatedAtBlock: 3325343,
		}

		respond({
			data: [slash],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		await expect(listOperatorSlashes(
			operatorAddress
		)).resolves.toMatchObject({
			data: [slash],
		})

		respond({
			data: [{
				...slash,
				wadSlashed: ['1', '2'],
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 100,
			},
		})
		await expect(listAvsSlashes(
			avsAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid slash identity`)

		respond({
			tvl: 12.5,
			tvlEth: 10,
		})
		await expect(getStrategyTvl(
			strategyAddress
		)).resolves.toMatchObject({
			tvl: 12.5,
			tvlEth: 10,
		})

		respond({
			tvl: -1,
			tvlEth: 10,
		})
		await expect(getStrategyTvl(
			strategyAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid strategy TVL`)

		respond({
			tvlEth: 10,
		})
		await expect(getStrategyTvl(
			strategyAddress
		)).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid strategy TVL response envelope`)
	})

	it('paginates protocol operator and AVS catalogs', async () => {
		const operator = {
			address: operatorAddress,
			metadataName: 'Example Operator',
			metadataDescription: null,
			metadataWebsite: null,
			metadataLogo: null,
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [{
				strategyAddress,
				shares: '42',
			}],
		}
		const avs = {
			address: avsAddress,
			metadataName: 'Example AVS',
			metadataDescription: null,
			metadataWebsite: null,
			metadataLogo: null,
			totalStakers: 12,
			totalOperators: 3,
			createdAtBlock: '100',
			updatedAtBlock: '101',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			shares: [{
				strategyAddress,
				shares: '42',
			}],
		}

		respond({
			data: [operator],
			meta: {
				total: 40,
				skip: 0,
				take: 25,
			},
		})
		await expect(listOperators({
			take: 25,
		})).resolves.toMatchObject({
			data: [operator],
			meta: {
				total: 40,
			},
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://api.eigenexplorer.test/operators?skip=0&take=25',
			{
				headers: {
					accept: 'application/json',
				},
			}
		)

		respond({
			data: [avs],
			meta: {
				total: 18,
				skip: 0,
				take: 25,
			},
		})
		await expect(listAvss({
			take: 25,
		})).resolves.toMatchObject({
			data: [avs],
			meta: {
				total: 18,
			},
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://api.eigenexplorer.test/avs?skip=0&take=25',
			{
				headers: {
					accept: 'application/json',
				},
			}
		)

		respond({
			data: [{
				address: operatorAddress,
			}],
			meta: {
				total: 1,
				skip: 0,
				take: 25,
			},
		})
		await expect(listOperators({
			take: 25,
		})).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid operators response envelope`)
	})

	it('slices reward strategy catalog with authoritative total', async () => {
		const strategies = [
			{
				strategyAddress,
				tokens: [tokenAddress],
			},
			{
				strategyAddress: '0x5555555555555555555555555555555555555555',
				tokens: [tokenAddress],
			},
			{
				strategyAddress: '0x6666666666666666666666666666666666666666',
				tokens: [tokenAddress],
			},
		]

		respond({
			strategies,
			total: 3,
		})
		await expect(listStrategies({
			skip: 1,
			take: 1,
		})).resolves.toEqual({
			data: [strategies[1]],
			meta: {
				total: 3,
				skip: 1,
				take: 1,
			},
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://api.eigenexplorer.test/rewards/strategies',
			{
				headers: {
					accept: 'application/json',
				},
			}
		)

		respond({
			strategies,
			total: 2,
		})
		await expect(listStrategies()).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid strategies total`)

		respond({
			strategies: [{
				strategyAddress,
				tokens: ['not-an-address'],
			}],
			total: 1,
		})
		await expect(listStrategies()).rejects.toThrow(`${Source.EigenExplorer_Rest}: invalid reward token address`)
	})
})
