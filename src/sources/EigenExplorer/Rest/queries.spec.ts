import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
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
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	getOperatorRewardInfo,
	getStaker,
	getStakerDeposits,
	getStakerWithdrawals,
} from '$/sources/EigenExplorer/Rest/queries.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.eigenexplorer.test',
	sourceFetch: vi.fn(),
}))

const binding = {
	provider: SourceProvider.EigenExplorer,
	source: Source.EigenExplorer_Rest,
	target: {
		kind: SourceTargetKind.Global,
		key: 'eigen-explorer-api',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://api.eigenexplorer.test',
		origin: 'https://api.eigenexplorer.test',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.OpenApiHttp,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		key: 'EIGEN_EXPLORER_API_TOKEN',
	}],
} as const satisfies SourceBinding

const stakerAddress = '0x1111111111111111111111111111111111111111'
const operatorAddress = '0x2222222222222222222222222222222222222222'
const strategyAddress = '0x3333333333333333333333333333333333333333'
const tokenAddress = '0x4444444444444444444444444444444444444444'
const transactionHash = `0x${'5'.repeat(64)}`
const withdrawalRoot = `0x${'6'.repeat(64)}`

const respond = (
	body: unknown
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			headers: {
				'content-type': 'application/json',
			},
		})
	)
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('EigenExplorer REST queries', () => {
	it('authenticates and validates exact staker shares', async () => {
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
			binding,
			'secret',
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
					'x-api-token': 'secret',
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
			binding,
			'secret',
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
			binding,
			'secret',
			stakerAddress
		)).rejects.toThrow('foreign deposit')
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
			binding,
			'secret',
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
			binding,
			'secret',
			operatorAddress
		)).rejects.toThrow('duplicate reward information')
		await expect(getStakerDeposits(
			binding,
			'secret',
			stakerAddress,
			{
				take: 101,
			}
		)).rejects.toThrow('between 1 and 100')
		expect(sourceFetch).toHaveBeenCalledTimes(1)
	})
})
