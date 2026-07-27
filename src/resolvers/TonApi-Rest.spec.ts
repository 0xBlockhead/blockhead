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
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import accountFixtureJson from '$/sources/TonApi/Rest/fixtures/account.json'
import type {
	TonApiAccount,
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

const tonApiBinding = bindings[Source.TonApi_Rest]

const accountResolver = tonApiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TonAccount
))
const networkResolver = tonApiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
))
const jettonResolver = tonApiResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.TonJetton
))

if (networkResolver == null || accountResolver == null || jettonResolver == null)
	throw new Error('TonApi-Rest spec missing network, account, or jetton resolver')

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
				origin: 'https://tonapi.io',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
			delivery: SourceDelivery.HttpProxy,
			credentials: [{
				scope: SourceCredentialScope.None,
			}],
			proxyId: '["TonApi_Rest","Caip2Network","ton:-239","HttpProxy","RestJson"]',
			artifacts: [{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/TonApi/Rest/types.ts',
				generated: false,
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
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_750_000_000_123)

		await expect(networkResolver.resolve[selector].resolve(network)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: 1_750_000_000_123,
					source: Source.TonApi_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'timestampMs')]: 1_750_000_000_123,
					[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'masterchainSeqno')]: 45_678_901n,
					[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'latestBlockUtimeMs')]: 1_750_000_000_000,
				},
			},
		])
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
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

	it('maps canonical raw address coordinates for NetworkAddress', async () => {
		sourceGetJson.mockResolvedValueOnce(accountFixture)
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
					},
				},
			],
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it('fails closed when TonAPI does not return a canonical raw address', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			address: 'EQ_not_a_raw_address',
		})

		await expect(accountResolver.resolve['NetworkAddress'].resolve(
			{
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			}
		)).rejects.toThrow('malformed raw address')
	})

	it('fails closed on an unsafe workchain coordinate', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...accountFixture,
			address: '9007199254740992:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
		})

		await expect(accountResolver.resolve['NetworkAddress'].resolve(
			{
				$network: {
					slug: 'ton',
				},
				address: 'EQ/a+b',
			}
		)).rejects.toThrow('malformed workchain')
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
			)).rejects.toThrow('malformed raw address')
	})
})
