import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/TonApi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import accountFixtureJson from '$/sources/TonApi/Rest/fixtures/account.json'
import type {
	TonApiAccount,
	TonApiBlockchainRawAccount,
	TonApiMasterchainHead,
} from '$/sources/TonApi/Rest/types.ts'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceGetJson,
}))

const {
	getAccount,
	getBlockchainMasterchainHead,
	getBlockchainRawAccount,
} = await import('$/sources/TonApi/Rest/queries.ts')
const { default: tonApiResolvers } = await import('$/resolvers/TonApi-Rest.ts')

const accountFixture = {
	...accountFixtureJson,
	status: 'active',
} satisfies TonApiAccount

const masterchainHeadFixture = {
	seqno: 45_678_901,
	gen_utime: 1_750_000_000,
} satisfies TonApiMasterchainHead

const rawAccountFixture = {
	address: accountFixture.address,
	balance: 1_234_567_890,
	status: 'active',
	last_transaction_lt: 34_758_440_000_003,
	last_transaction_hash: 'd43981844b5fb58ffab8a78ef19b5b4c3b1d2b4201b57a7a5fdfdb425ba81c9e',
	frozen_hash: '088b436a846d92281734236967970612f87fbd64a2cd3573107948379e8e4161',
	storage: {
		used_cells: 1,
		used_bits: 2,
		used_public_cells: 0,
		last_paid: 1_720_000_000,
		due_payment: 0,
	},
} satisfies TonApiBlockchainRawAccount


const tonApiBinding = bindings[Source.TonApi_Rest][0]

const accountResolver = tonApiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TonAccount
))
const networkResolver = tonApiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
))
const jettonResolver = tonApiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TonJetton
))
const transactionResolver = tonApiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TonTransaction
))

if (
	networkResolver == null
	|| accountResolver == null
	|| jettonResolver == null
	|| transactionResolver == null
)
	throw new Error('TonApi-Rest spec missing network, account, transaction, or jetton resolver')

describe('TonAPI masterchain-head transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('selects the exact canonical TON mainnet binding', () => {
		expect(tonApiBinding).toEqual({
			source: Source.TonApi_Rest,
			target: {
				kind: SourceTargetKind.Caip2Network,
				key: 'ton:-239',
			},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://tonapi.io',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
			delivery: SourceDelivery.HttpProxy,
			credentials: [],
			artifacts: [{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/TonApi/Rest/types.ts',
			}],
		})
	})

	it('uses the canonical binding and typed masterchain-head endpoint', async () => {
		sourceGetJson.mockResolvedValueOnce(masterchainHeadFixture)

		await expect(getBlockchainMasterchainHead()).resolves.toEqual(masterchainHeadFixture)
		expect(sourceGetJson).toHaveBeenCalledWith(
			tonApiBinding,
			'https://tonapi.io/v2/blockchain/masterchain-head'
		)
	})

	it('rejects malformed and unsafe masterchain-head wire data', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...masterchainHeadFixture,
			seqno: '45678901',
		})

		await expect(getBlockchainMasterchainHead()).rejects.toThrow()

		sourceGetJson.mockResolvedValueOnce({
			...masterchainHeadFixture,
			gen_utime: Number.MAX_SAFE_INTEGER,
		})

		await expect(getBlockchainMasterchainHead()).rejects.toThrow('safe numeric bounds')
	})
})

describe('TonAPI network observation resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		[
			'Caip2',
			{
				caip2: {
					namespace: 'ton',
					reference: '-239',
				},
			},
		],
		[
			'Slug',
			{
				slug: 'ton',
			},
		],
	] as const)('maps %s to one canonical embedded observation row', async (selector, network) => {
		sourceGetJson.mockResolvedValueOnce(masterchainHeadFixture)
		await expect(networkResolver.resolve[selector].resolve(network)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: 1_750_000_000_000,
					source: Source.TonApi_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'timestampMs')]: 1_750_000_000_000,
					[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'masterchainSeqno')]: 45_678_901n,
					[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'latestBlockUtimeMs')]: 1_750_000_000_000,
				},
			},
		])
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it('does not register a direct TonNetwork_Timestamp resolver', () => {
		expect(tonApiResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.TonNetwork_Timestamp
		))).toBe(false)
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(networkResolver.resolve['Slug'].resolve({
			slug: 'ethereum',
		})).rejects.toThrow('unsupported network')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})

describe('TonAPI account transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the selector address in the typed account endpoint', async () => {
		sourceGetJson.mockResolvedValueOnce(accountFixture)

		await expect(getAccount('EQ/a+b')).resolves.toEqual(accountFixture)
		expect(sourceGetJson).toHaveBeenCalledWith(
			tonApiBinding,
			'https://tonapi.io/v2/accounts/EQ%2Fa%2Bb'
		)
	})

	it('rejects malformed account wire data', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			balance: 1,
		})

		await expect(getAccount('EQ/a+b')).rejects.toThrow()
	})

	it('rejects a balance that cannot be represented as bigint', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			balance: '1.5',
		})

		await expect(getAccount('EQ/a+b')).rejects.toThrow('non-negative decimal integer')
	})
})

describe('TonAPI account resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps canonical raw address coordinates and enrolled raw-account leftovers for NetworkAddress', async () => {
		sourceGetJson.mockImplementation(async (_binding, url: string) => (
			url.includes('/blockchain/accounts/') ?
				rawAccountFixture
			:
				accountFixture
		))
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_750_000_000_000)

		await expect(accountResolver.resolve['NetworkAddress'].resolve(
			{
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			}
		)).resolves.toEqual({
			workchain: 0,
			addressHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$account: {
							$network: {
								slug: 'ton',
							},
							address: 'EQ/a+b',
						},
						timestampMs: 1_750_000_000_000,
						source: Source.TonApi_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'balanceNano')]: BigInt(accountFixture.balance),
						[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'status')]: accountFixture.status,
						[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'lastActivityTimestampMs')]: accountFixture.last_activity * 1_000,
						[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'lastTransactionLt')]: BigInt(rawAccountFixture.last_transaction_lt),
						[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'lastTransactionHash')]: rawAccountFixture.last_transaction_hash,
						[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'frozenHash')]: rawAccountFixture.frozen_hash,
					},
				},
			],
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(2)
	})

	it('fails closed when TonAPI does not return a canonical raw address', async () => {
		sourceGetJson.mockImplementation(async (_binding, url: string) => (
			url.includes('/blockchain/accounts/') ?
				rawAccountFixture
			:
				{
					...accountFixture,
					address: 'EQ_not_a_raw_address',
				}
		))

		await expect(accountResolver.resolve['NetworkAddress'].resolve(
			{
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			}
	)).rejects.toThrow('malformed raw account address')
	})

	it('fails closed on an unsafe workchain coordinate', async () => {
		sourceGetJson.mockImplementation(async (_binding, url: string) => (
			url.includes('/blockchain/accounts/') ?
				rawAccountFixture
			:
				{
					...accountFixture,
					address: '9007199254740992:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
				}
		))

		await expect(accountResolver.resolve['NetworkAddress'].resolve(
			{
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			}
	)).rejects.toThrow('malformed raw account address')
	})

	it('rejects a non-TON parent before transport', async () => {
		await expect(accountResolver.resolve['NetworkAddress'].resolve(
			{
				$network: {
					slug: 'ethereum',
				},
				address: 'EQ/a+b',
			}
		)).rejects.toThrow('unsupported network')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})

describe('TonAPI jetton resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps a typed master-account response without changing the requested jetton identity', async () => {
		sourceGetJson.mockResolvedValueOnce(accountFixture)

		await expect(jettonResolver.resolve[
			'NetworkMasterAddress'
		].resolve(
			{
				$network: {
					slug: 'ton',
				},
				masterAddress: 'EQ/a+b',
				}
			)).resolves.toEqual({
			$masterAccount: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'ton',
					},
					address: accountFixture.address,
				},
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			tonApiBinding,
			'https://tonapi.io/v2/accounts/EQ%2Fa%2Bb'
		)
	})

	it('rejects a non-TON parent before transport', async () => {
		await expect(jettonResolver.resolve[
			'NetworkMasterAddress'
		].resolve(
			{
				$network: {
					slug: 'ethereum',
				},
				masterAddress: 'EQ/a+b',
				}
			)).rejects.toThrow('unsupported network')

		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects malformed provider account identity instead of fabricating a master account', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			address: 'EQ_not_a_raw_address',
		})

		await expect(jettonResolver.resolve[
			'NetworkMasterAddress'
		].resolve(
			{
				$network: {
					slug: 'ton',
				},
				masterAddress: 'EQ/a+b',
				}
	)).rejects.toThrow('malformed raw account address')
	})
})

describe('TonAPI transaction resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		[
			'AccountLt',
			{},
		],
		[
			'AccountLtHash',
			{
				hash: 'd43981844b5fb58ffab8a78ef19b5b4c3b1d2b4201b57a7a5fdfdb425ba81c9e',
			},
		],
	] as const)('maps the exact %s selector to native TonAPI fields', async (selector, identity) => {
		sourceGetJson
			.mockResolvedValueOnce(accountFixture)
			.mockResolvedValueOnce({
				transactions: [{
					hash: 'D43981844B5FB58FFAB8A78EF19B5B4C3B1D2B4201B57A7A5FDFDB425BA81C9E',
					lt: 34_758_440_000_003,
					account: {
						address: accountFixture.address,
						is_scam: false,
						is_wallet: true,
					},
					success: true,
					utime: 1_674_646_605,
					total_fees: 333_328,
					end_balance: 1_000,
					transaction_type: 'TransOrd',
					block: '(0,8000000000000000,32400585)',
					aborted: false,
					destroyed: false,
				}],
			})

		await expect(transactionResolver.resolve[selector].resolve({
			$account: {
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			},
			lt: 34_758_440_000_003n,
			...identity,
		})).resolves.toEqual({
			hash: 'd43981844b5fb58ffab8a78ef19b5b4c3b1d2b4201b57a7a5fdfdb425ba81c9e',
			nowMs: 1_674_646_605_000,
			transactionKind: 'TransOrd',
			totalFeesNano: 333_328n,
		})
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			tonApiBinding,
			'https://tonapi.io/v2/accounts/EQ%2Fa%2Bb'
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			tonApiBinding,
			`https://tonapi.io/v2/blockchain/accounts/${encodeURIComponent(accountFixture.address)}/transactions?limit=1&sort_order=desc&before_lt=34758440000004`
		)
	})

	it('rejects non-TON parents before transport', async () => {
		await expect(transactionResolver.resolve['AccountLt'].resolve({
			$account: {
				$network: {
					slug: 'ethereum',
				},
				address: 'EQ/a+b',
			},
			lt: 1n,
		})).rejects.toThrow('unsupported network')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})

describe('TonAPI raw account transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the blockchain raw-account endpoint and canonicalizes identity leftovers', async () => {
		sourceGetJson.mockResolvedValueOnce(rawAccountFixture)

		await expect(getBlockchainRawAccount('EQ/a+b')).resolves.toMatchObject({
			address: accountFixture.address,
			last_transaction_hash: rawAccountFixture.last_transaction_hash,
			frozen_hash: rawAccountFixture.frozen_hash,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			tonApiBinding,
			'https://tonapi.io/v2/blockchain/accounts/EQ%2Fa%2Bb'
		)
	})

	it('rejects malformed last-transaction hashes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...rawAccountFixture,
			last_transaction_hash: 'not-a-hash',
		})
		await expect(getBlockchainRawAccount(accountFixture.address)).rejects.toThrow('malformed last transaction hash')
	})
})
