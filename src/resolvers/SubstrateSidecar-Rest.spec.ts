import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'http://127.0.0.1:8080',
	sourceFetch,
	sourceGetJson: async (_binding: unknown, url: string) => {
		const response = await sourceFetch(_binding, url)
		return response.json()
	},
	sourceGetText: vi.fn(),
}))

const { default: sidecar } = await import('$/resolvers/SubstrateSidecar-Rest.ts')

const accountResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotAccount }
> => resolver.entityType === EntityType.PolkadotAccount)

const blockResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotBlock }
> => resolver.entityType === EntityType.PolkadotBlock)

const palletResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotPallet }
> => resolver.entityType === EntityType.PolkadotPallet)

const networkBlockListResolver = sidecar.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Polkadot' in resolver.projections
	&& '$$blocks' in resolver.projections.Polkadot
	&& typeof resolver.projections.Polkadot.$$blocks === 'function'
))

if (
	accountResolver == null
	|| blockResolver == null
	|| palletResolver == null
	|| networkBlockListResolver == null
)
	throw new Error('Substrate Sidecar resolvers are missing')

const account = {
	$network: {
		caip2: networkBySlug.polkadot.caip2,
	},
	accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const balanceInfo = {
	at: {
		hash: '0xFINALIZED_BLOCK_HASH',
		height: '20000000',
	},
	nonce: '9007199254740993',
	tokenSymbol: 'DOT',
	free: '123456789012345678901234',
	reserved: '0',
	frozen: '0',
	transferable: '123456789012345678901234',
}
const block = {
	number: '10',
	hash: '0xBLOCK_HASH',
	parentHash: '0xPARENT_HASH',
	stateRoot: '0xSTATE_ROOT',
	extrinsicsRoot: '0xEXTRINSICS_ROOT',
	extrinsics: [
		{
			method: {
				pallet: 'balances',
				method: 'transferAllowDeath',
			},
			signature: {
				signer: {
					id: account.accountId,
				},
			},
			hash: '0xEXTRINSIC_HASH',
			events: [
				{
					method: {
						pallet: 'balances',
						method: 'Transfer',
					},
				},
				{
					method: 'system.ExtrinsicSuccess',
				},
			],
			success: true,
		},
	],
}

describe('Substrate Sidecar Polkadot account resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		vi.spyOn(Date, 'now').mockReturnValue(1_753_000_100_000)
		sourceFetch.mockResolvedValue(new Response(JSON.stringify(balanceInfo)))
	})

	it('preserves the SS58 subject and lossless live state values', async () => {
		const snapshot = await accountResolver.resolve[
			'NetworkAccountId'
		].resolve(account, context)
		const timestamps = accountResolver.projections.$$timestamps(snapshot)

		expect(sourceFetch.mock.calls[0][1]).toBe(
			`http://127.0.0.1:8080/accounts/${account.accountId}/balance-info`
		)
		expect(timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				timestampMs: 1_753_000_100_000,
				source: Source.SubstrateSidecar_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], '$account')]: {
					[EntityMetaKey.Selector]: account,
				},
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'timestampMs')]: 1_753_000_100_000,
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'source')]: Source.SubstrateSidecar_Rest,
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'nonce')]: 9_007_199_254_740_993n,
				[entityFieldAddressKey(EntityType.PolkadotAccount_Timestamp, [], 'freeBalancePlancks')]: 123_456_789_012_345_678_901_234n,
			},
		}])
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(accountResolver.resolve[
			'NetworkAccountId'
		].resolve({
			...account,
			$network: {
				caip2: networkBySlug.ethereum.caip2,
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed on malformed state identities and amounts', async () => {
		for (const response of [
			{
				...balanceInfo,
				at: {
					...balanceInfo.at,
					height: '-1',
				},
			},
			{
				...balanceInfo,
				nonce: '1.5',
			},
			{
				...balanceInfo,
				free: '-1',
			},
			{
				...balanceInfo,
				reserved: 'not-an-amount',
			},
		]) {
			sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(response)))
			await expect(accountResolver.resolve[
				'NetworkAccountId'
			].resolve(account, context)).rejects.toThrow(/invalid account balance info response envelope|malformed account/)
		}
	})
})

describe('Substrate Sidecar Polkadot block / pallet projections', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('projects NetworkBlockNumber and object/string event methods', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(block)))
		const snapshot = await blockResolver.resolve.NetworkBlockNumber.resolve({
			$network: account.$network,
			blockNumber: 10n,
		}, context)
		const events = blockResolver.projections.$$events(snapshot)

		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks/10')
		expect(blockResolver.projections.hash(snapshot)).toBe(block.hash)
		expect(blockResolver.projections.$$extrinsics(snapshot)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], '$signer')]: {
				[EntityMetaKey.Selector]: account,
			},
			[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'callName')]: 'transferAllowDeath',
		})
		expect(events.map((event) => event[EntityMetaKey.Fields]?.[
			entityFieldAddressKey(EntityType.PolkadotEvent, [], 'eventName')
		])).toEqual([
			'Transfer',
			'ExtrinsicSuccess',
		])
	})

	it('normalizes v14 metadata pallet indexes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			magicNumber: 1635018093,
			metadata: {
				v14: {
					pallets: [
						{
							name: 'System',
							index: '0',
						},
						{
							name: 'Balances',
							index: 10,
						},
					],
				},
			},
		})))
		const snapshot = await palletResolver.resolve.NetworkPalletName.resolve({
			$network: account.$network,
			palletName: 'Balances',
		}, context)
		expect(palletResolver.projections.index(snapshot)).toBe(10)
	})

	it('lists tip blocks from finalized head header + range', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				number: block.number,
				parentHash: block.parentHash,
				stateRoot: block.stateRoot,
				extrinsicsRoot: block.extrinsicsRoot,
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify([
				{
					...block,
					number: '9',
					hash: '0xPARENT_HASH',
					parentHash: '0xGRANDPARENT_HASH',
				},
				block,
			])))

		const snapshot = await networkBlockListResolver.resolve.Slug.resolve(
			account.$network,
			context
		)
		expect(networkBlockListResolver.projections.Polkadot.$$blocks(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					blockNumber: 10n,
					hash: '0xBLOCK_HASH',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					blockNumber: 9n,
					hash: '0xPARENT_HASH',
				},
			},
		])
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks/head/header?finalized=true')
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/blocks?range=9-10')
	})
})

describe('Substrate Sidecar network observation + validator leftovers', () => {
	const networkTimestampResolver = sidecar.resolvers.find((
		resolver
	): resolver is Extract<
		typeof sidecar.resolvers[number],
		{ entityType: EntityType.Network_Timestamp }
	> => resolver.entityType === EntityType.Network_Timestamp)

	const validatorResolver = sidecar.resolvers.find((
		resolver
	): resolver is Extract<
		typeof sidecar.resolvers[number],
		{ entityType: EntityType.PolkadotValidator }
	> => resolver.entityType === EntityType.PolkadotValidator)

	if (networkTimestampResolver == null || validatorResolver == null)
		throw new Error('Substrate Sidecar network/validator resolvers are missing')

	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('projects Network_Timestamp from head + /runtime', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify(block)))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				at: {
					hash: block.hash,
					height: block.number,
				},
				specName: 'polkadot',
				implName: 'parity-polkadot',
				authoringVersion: 0,
				specVersion: 1007001,
				transactionVersion: 26,
				stateVersion: 1,
			})))

		const snapshot = await networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: account.$network,
			timestampMs: 1_753_000_100_000,
			source: Source.SubstrateSidecar_Rest,
		}, context)

		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks/head?finalized=true')
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/runtime')
		expect(networkTimestampResolver.projections.Polkadot.finalizedBlockNumber(snapshot)).toBe(10n)
		expect(networkTimestampResolver.projections.Polkadot.finalizedBlockHash(snapshot)).toBe(block.hash)
		expect(networkTimestampResolver.projections.Polkadot.finalizedExtrinsicCount(snapshot)).toBe(1)
		expect(networkTimestampResolver.projections.Polkadot.runtimeSpecName(snapshot)).toBe('polkadot')
		expect(networkTimestampResolver.projections.Polkadot.runtimeSpecVersion(snapshot)).toBe(1007001)
		expect(networkTimestampResolver.projections.Polkadot.transactionVersion(snapshot)).toBe(26)
		expect(networkTimestampResolver.projections.Polkadot.stateVersion(snapshot)).toBe(1)
	})

	it('resolves a validator stash from the staking list when public Sidecar answers', async () => {
		const stashAccountId = '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq'
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			validators: [
				{
					accountId: stashAccountId,
					totalStake: '1000',
				},
			],
		})))
		await expect(validatorResolver.resolve.NetworkStashAccountId.resolve({
			$network: account.$network,
			stashAccountId,
		}, context)).resolves.toEqual({})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/pallets/staking/validators')
	})
})
