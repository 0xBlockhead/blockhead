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
	firstHttpUrlForBinding: (binding: {
		endpoints: readonly {
			locator: string
		}[]
	}) => (
		binding.endpoints[0].locator.includes('asset-hub') ?
			'http://127.0.0.1:8081'
		:
			'http://127.0.0.1:8080'
	),
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
> => (
	resolver.entityType === EntityType.PolkadotAccount
	&& '$$timestamps' in resolver.projections
))

const accountAssetBalanceResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotAccount }
> => (
	resolver.entityType === EntityType.PolkadotAccount
	&& '$$assetBalanceTimestamps' in resolver.projections
))

const assetResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotAsset }
> => resolver.entityType === EntityType.PolkadotAsset)

const assetTimestampResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotAsset_Timestamp }
> => resolver.entityType === EntityType.PolkadotAsset_Timestamp)

const assetBalanceTimestampResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotAssetBalance_Timestamp }
> => resolver.entityType === EntityType.PolkadotAssetBalance_Timestamp)

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
	&& typeof resolver.projections.Polkadot.$$blocks === 'object'
	&& resolver.projections.Polkadot.$$blocks != null
	&& 'select' in resolver.projections.Polkadot.$$blocks
))

const networkReferendumListResolver = sidecar.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Polkadot' in resolver.projections
	&& '$$referenda' in resolver.projections.Polkadot
))

const networkValidatorListResolver = sidecar.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Polkadot' in resolver.projections
	&& '$$validators' in resolver.projections.Polkadot
))

const validatorEraResolver = sidecar.resolvers.find((
	resolver
): resolver is Extract<
	typeof sidecar.resolvers[number],
	{ entityType: EntityType.PolkadotValidator_Era }
> => resolver.entityType === EntityType.PolkadotValidator_Era)

if (
	accountResolver == null
	|| accountAssetBalanceResolver == null
	|| assetResolver == null
	|| assetTimestampResolver == null
	|| assetBalanceTimestampResolver == null
	|| blockResolver == null
	|| palletResolver == null
	|| networkBlockListResolver == null
	|| networkReferendumListResolver == null
	|| networkValidatorListResolver == null
	|| validatorEraResolver == null
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

describe('Substrate Sidecar Asset Hub asset projections', () => {
	const foreignMultiLocation = {
		parents: '1',
		interior: {
			x1: [
				{
					parachain: '3369',
				},
			],
		},
	}
	const assetInfo = {
		at: {
			hash: '0xAH_HASH',
			height: '19148225',
		},
		assetInfo: {
			owner: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
			issuer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
			admin: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
			freezer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
			supply: '77998622058218',
			deposit: '1000000000000',
			minBalance: '10000',
			isSufficient: true,
			accounts: '13853',
			sufficients: '13749',
			approvals: '22',
			status: 'Live',
		},
		assetMetaData: {
			deposit: '2008200000',
			name: '0x54657468657220555344',
			symbol: '0x55534474',
			decimals: '6',
			isFrozen: false,
		},
	}

	beforeEach(() => {
		sourceFetch.mockReset()
		vi.spyOn(Date, 'now').mockReturnValue(1_753_000_100_000)
	})

	it('projects PolkadotAccount.$$assetBalanceTimestamps from assets + foreign assets', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				at: {
					hash: '0xAH_HASH',
					height: '19148225',
				},
				assets: [
					{
						assetId: 1984,
						balance: '3790709913555',
						isFrozen: false,
					},
				],
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				at: {
					hash: '0xAH_FOREIGN_HASH',
					height: '19148226',
				},
				foreignAssets: [
					{
						multiLocation: foreignMultiLocation,
						balance: '2999978886176645548557674',
						isFrozen: true,
					},
				],
			})))

		const snapshot = await accountAssetBalanceResolver.resolve.NetworkAccountId.resolve(account, context)
		const timestamps = accountAssetBalanceResolver.projections.$$assetBalanceTimestamps(snapshot)
		const foreignAssetId = JSON.stringify(foreignMultiLocation)

		expect(sourceFetch.mock.calls[0][1]).toBe(
			`http://127.0.0.1:8081/accounts/${account.accountId}/asset-balances`
		)
		expect(sourceFetch.mock.calls[1][1]).toBe(
			`http://127.0.0.1:8081/accounts/${account.accountId}/foreign-asset-balances`
		)
		expect(timestamps).toHaveLength(2)
		expect(timestamps[0]).toEqual({
			[EntityMetaKey.Selector]: {
				$account: account,
				$asset: {
					$network: account.$network,
					assetKind: 'assets',
					assetId: '1984',
				},
				timestampMs: 1_753_000_100_000,
				source: Source.SubstrateSidecar_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], '$account')]: {
					[EntityMetaKey.Selector]: account,
				},
				[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], '$asset')]: {
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						assetKind: 'assets',
						assetId: '1984',
					},
				},
				[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'timestampMs')]: 1_753_000_100_000,
				[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'source')]: Source.SubstrateSidecar_Rest,
				[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'blockNumber')]: 19_148_225n,
				[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'blockHash')]: '0xAH_HASH',
				[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'freeBalancePlancks')]: 3_790_709_913_555n,
				[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'status')]: 'Live',
			},
		})
		expect(timestamps[1][EntityMetaKey.Selector]).toMatchObject({
			$asset: {
				assetKind: 'foreignAssets',
				assetId: foreignAssetId,
			},
		})
		expect(timestamps[1][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'blockHash')]: '0xAH_FOREIGN_HASH',
			[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'freeBalancePlancks')]: 2_999_978_886_176_645_548_557_674n,
			[entityFieldAddressKey(EntityType.PolkadotAssetBalance_Timestamp, [], 'status')]: 'Frozen',
		})
	})

	it('projects PolkadotAsset tip metadata from getAssetInfo', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(assetInfo)))
		const assetSelector = {
			$network: account.$network,
			assetKind: 'assets',
			assetId: '1984',
		}
		const snapshot = await assetResolver.resolve.NetworkAssetKindAssetId.resolve(assetSelector, context)
		const timestamps = assetResolver.projections.$$timestamps(snapshot)

		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8081/pallets/assets/1984/asset-info')
		expect(timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$asset: assetSelector,
				timestampMs: 1_753_000_100_000,
				source: Source.SubstrateSidecar_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], '$asset')]: {
					[EntityMetaKey.Selector]: assetSelector,
				},
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'timestampMs')]: 1_753_000_100_000,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'source')]: Source.SubstrateSidecar_Rest,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'blockNumber')]: 19_148_225n,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'blockHash')]: '0xAH_HASH',
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'supply')]: 77_998_622_058_218n,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'holderCount')]: 13_853,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'status')]: 'Live',
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'symbol')]: 'USDt',
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'name')]: 'Tether USD',
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'decimals')]: 6,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'existentialDepositPlancks')]: 10_000n,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'owner')]: assetInfo.assetInfo.owner,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'issuer')]: assetInfo.assetInfo.issuer,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'admin')]: assetInfo.assetInfo.admin,
				[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'freezer')]: assetInfo.assetInfo.freezer,
			},
		}])
	})

	it('resolves singular PolkadotAsset_Timestamp and PolkadotAssetBalance_Timestamp tips', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(assetInfo)))
		const assetSelector = {
			$network: account.$network,
			assetKind: 'assets',
			assetId: '1984',
		}
		const assetTimestamp = await assetTimestampResolver.resolve.AssetTimestampMsSource.resolve({
			$asset: assetSelector,
			timestampMs: 1_753_000_100_000,
			source: Source.SubstrateSidecar_Rest,
		}, context)
		expect(assetTimestampResolver.projections.symbol(assetTimestamp)).toBe('USDt')
		expect(assetTimestampResolver.projections.holderCount(assetTimestamp)).toBe(13_853)

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assets: [
				{
					assetId: '1984',
					balance: '42',
					isFrozen: false,
				},
			],
		})))
		const balanceTimestamp = await assetBalanceTimestampResolver.resolve.AccountAssetTimestampMsSource.resolve({
			$account: account,
			$asset: assetSelector,
			timestampMs: 1_753_000_100_000,
			source: Source.SubstrateSidecar_Rest,
		}, context)
		expect(assetBalanceTimestampResolver.projections.freeBalancePlancks(balanceTimestamp)).toBe(42n)
		expect(assetBalanceTimestampResolver.projections.status(balanceTimestamp)).toBe('Live')
		expect(sourceFetch.mock.calls[1][1]).toBe(
			`http://127.0.0.1:8081/accounts/${account.accountId}/asset-balances?assets%5B%5D=1984`
		)
	})

	it('projects foreignAssets PolkadotAsset tip metadata from getForeignAssetInfo', async () => {
		const foreignAssetId = JSON.stringify(foreignMultiLocation)
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_FOREIGN_HASH',
				height: '19148226',
			},
			items: [
				{
					multiLocation: foreignMultiLocation,
					foreignAssetInfo: assetInfo.assetInfo,
					foreignAssetMetadata: assetInfo.assetMetaData,
				},
			],
		})))
		const assetSelector = {
			$network: account.$network,
			assetKind: 'foreignAssets',
			assetId: foreignAssetId,
		}
		const snapshot = await assetResolver.resolve.NetworkAssetKindAssetId.resolve(assetSelector, context)
		const timestamps = assetResolver.projections.$$timestamps(snapshot)

		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8081/pallets/foreign-assets')
		expect(timestamps[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'symbol')]: 'USDt',
			[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'name')]: 'Tether USD',
			[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'blockHash')]: '0xAH_FOREIGN_HASH',
			[entityFieldAddressKey(EntityType.PolkadotAsset_Timestamp, [], 'supply')]: 77_998_622_058_218n,
		})
	})

	it('rejects unknown PolkadotAsset assetKind without transport', async () => {
		await expect(assetResolver.resolve.NetworkAssetKindAssetId.resolve({
			$network: account.$network,
			assetKind: 'poolAssets',
			assetId: '1',
		}, context)).rejects.toThrow('unsupported assetKind poolAssets')
		expect(sourceFetch).not.toHaveBeenCalled()
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
		const events = blockResolver.projections.$$events.select(snapshot)

		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks/10')
		expect(blockResolver.projections.hash(snapshot)).toBe(block.hash)
		expect(blockResolver.projections.$$extrinsics.select(snapshot)[0][EntityMetaKey.Fields]).toMatchObject({
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
		expect(blockResolver.projections.$$extrinsics.resolveCount(snapshot)).toBe(1)
		expect(blockResolver.projections.$$events.resolveCount(snapshot)).toBe(2)
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

	it('lists an offset block page from finalized head header + range', async () => {
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
					number: '7',
					hash: '0xBLOCK_7',
					parentHash: '0xGRANDPARENT_HASH',
				},
				{
					...block,
					number: '8',
					hash: '0xBLOCK_8',
				},
			])))

		const snapshot = await networkBlockListResolver.resolve.Slug.resolve(
			account.$network,
			{
				...context,
				pagination: {
					limit: 2,
					offset: 2,
				},
			}
		)
		expect(networkBlockListResolver.projections.Polkadot.$$blocks.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					blockNumber: 8n,
					hash: '0xBLOCK_8',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					blockNumber: 7n,
					hash: '0xBLOCK_7',
				},
			},
		])
		expect(networkBlockListResolver.projections.Polkadot.$$blocks.continuation(snapshot).token).toBe('6')
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks/head/header?finalized=true')
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/blocks?range=7-8')

		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				...block,
				number: '12',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify([{
				...block,
				number: '6',
				hash: '0xBLOCK_6',
			}])))
		const continuedSnapshot = await networkBlockListResolver.resolve.Slug.resolve(
			account.$network,
			{
				...context,
				pagination: {
					limit: 1,
				},
				providerContinuationToken: '6',
			}
		)
		expect(networkBlockListResolver.projections.Polkadot.$$blocks.select(continuedSnapshot)[0][EntityMetaKey.Selector]).toEqual({
			$network: account.$network,
			blockNumber: 6n,
			hash: '0xBLOCK_6',
		})
		expect(networkBlockListResolver.projections.Polkadot.$$blocks.continuation(continuedSnapshot).token).toBe('5')
		expect(sourceFetch.mock.calls[3][1]).toBe('http://127.0.0.1:8080/blocks?range=6-6')
	})
})

describe('Substrate Sidecar network observation + validator leftovers', () => {
	const networkTimestampResolver = sidecar.resolvers.find((
		resolver
	): resolver is Extract<
		typeof sidecar.resolvers[number],
		{ entityType: EntityType.Network }
	> => (
		resolver.entityType === EntityType.Network
		&& '$$timestamps' in resolver.projections
	))

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

	it('projects Network_Timestamp from head + /runtime + /node/network', async () => {
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
			.mockResolvedValueOnce(new Response(JSON.stringify({
				nodeRoles: [
					{
						full: null,
					},
				],
				numPeers: '42',
				isSyncing: false,
				shouldHavePeers: true,
				peersInfo: 'Cannot query system_peers from node.',
			})))

		const snapshot = await networkTimestampResolver.resolve.Slug.resolve(account.$network, context)
		const observation = networkTimestampResolver.projections.$$timestamps(snapshot)[0]

		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks/head?finalized=true')
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/runtime')
		expect(sourceFetch.mock.calls[2][1]).toBe('http://127.0.0.1:8080/node/network')
		expect(observation?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'finalizedBlockNumber')]: 10n,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'finalizedBlockHash')]: block.hash,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'finalizedExtrinsicCount')]: 1,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'runtimeSpecName')]: 'polkadot',
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'runtimeSpecVersion')]: 1007001,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'transactionVersion')]: 26,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'stateVersion')]: 1,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'peerCount')]: 42,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'isSyncing')]: false,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'shouldHavePeers')]: true,
		})
		expect(sidecar.resolvers.some((resolver) => (
			resolver.entityType === EntityType.Network_Timestamp
		))).toBe(false)
	})

	it('resolves active validator-era commission, activity, and pending slashing state', async () => {
		const stashAccountId = '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq'
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				at: {
					hash: '0xSTAKING_PROGRESS',
					height: '32442435',
				},
				activeEra: '1702',
				forceEra: 'NotForcing',
				unappliedSlashes: [
					{
						validator: stashAccountId,
						own: '10000000000',
						others: [],
						reporters: [],
						payout: '0',
					},
				],
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				at: {
					hash: '0xSTAKING_PROGRESS',
					height: '32442435',
				},
				validators: [
					{
						address: stashAccountId,
						controllerId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
						status: 'active',
						commission: '100000000',
						totalStake: '123456789012345678901234',
						blocked: false,
					},
				],
			})))

		const selector = {
			$validator: {
				$network: account.$network,
				stashAccountId,
			},
			eraIndex: 1702n,
			source: Source.SubstrateSidecar_Rest,
		}
		const snapshot = await validatorEraResolver.resolve.ValidatorEraIndexSource.resolve(selector, context)

		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			'http://127.0.0.1:8080/pallets/staking/progress',
			'http://127.0.0.1:8080/pallets/staking/validators?at=0xSTAKING_PROGRESS',
		])
		expect(validatorEraResolver.projections.$validator(snapshot)).toEqual({
			[EntityMetaKey.Selector]: selector.$validator,
		})
		expect(validatorEraResolver.projections.eraIndex(snapshot)).toBe(1702n)
		expect(validatorEraResolver.projections.$controller(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
			},
		})
		expect(validatorEraResolver.projections.commissionPerBillion(snapshot)).toBe(100_000_000)
		expect(validatorEraResolver.projections.totalStakePlancks(snapshot)).toBe(123_456_789_012_345_678_901_234n)
		expect(validatorEraResolver.projections.active(snapshot)).toBe(true)
		expect(validatorEraResolver.projections.slashed(snapshot)).toBe(true)
	})

	it('rejects historical aliases and invalid active-era commission', async () => {
		const stashAccountId = '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq'
		const selector = {
			$validator: {
				$network: account.$network,
				stashAccountId,
			},
			eraIndex: 1701n,
			source: Source.SubstrateSidecar_Rest,
		}
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				at: {
					hash: '0xSTAKING_PROGRESS',
					height: '32442435',
				},
				activeEra: '1702',
				forceEra: 'NotForcing',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				validators: [],
			})))
		await expect(
			validatorEraResolver.resolve.ValidatorEraIndexSource.resolve(selector, context)
		).rejects.toThrow('requested validator era is not the active era')

		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				at: {
					hash: '0xSTAKING_PROGRESS',
					height: '32442435',
				},
				activeEra: '1702',
				forceEra: 'NotForcing',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				validators: [
					{
						address: stashAccountId,
						status: 'active',
						commission: '1000000001',
					},
				],
			})))
		await expect(
			validatorEraResolver.resolve.ValidatorEraIndexSource.resolve({
				...selector,
				eraIndex: 1702n,
			}, context)
		).rejects.toThrow('invalid validator commission')

		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				at: {
					hash: '0xSTAKING_PROGRESS',
					height: '32442435',
				},
				activeEra: '1702',
				forceEra: 'NotForcing',
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				validators: [
					{
						address: stashAccountId,
						status: 'active',
						commission: '100000000',
						totalStake: '1.5',
					},
				],
			})))
		await expect(
			validatorEraResolver.resolve.ValidatorEraIndexSource.resolve({
				...selector,
				eraIndex: 1702n,
			}, context)
		).rejects.toThrow('malformed validator stake')
	})

	it('resolves ongoing referendum identity and its block-anchored lifecycle observation', async () => {
		const referendumResolver = sidecar.resolvers.find((
			resolver
		): resolver is Extract<
			typeof sidecar.resolvers[number],
			{ entityType: EntityType.PolkadotReferendum }
		> => resolver.entityType === EntityType.PolkadotReferendum)
		if (referendumResolver == null)
			throw new Error('Substrate Sidecar referendum resolver is missing')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xREF_AT',
				height: '32442435',
			},
			referenda: [
				{
					id: '1284',
					submitted: '32440000',
					deciding: {
						since: '32441000',
						confirming: '32442000',
					},
					enactment: {
						at: '32450000',
					},
				},
			],
		})))
		const snapshot = await referendumResolver.resolve.NetworkReferendumId.resolve({
			$network: account.$network,
			referendumId: '1284',
		}, context)
		expect(referendumResolver.projections.submittedAtBlockNumber(snapshot)).toBe(32_440_000n)
		const [observation] = referendumResolver.projections.$$timestamps(snapshot)
		expect(observation[EntityMetaKey.Selector]).toMatchObject({
			$referendum: {
				$network: account.$network,
				referendumId: '1284',
			},
			source: Source.SubstrateSidecar_Rest,
		})
		expect(observation[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'blockNumber')]: 32_442_435n,
			[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'blockHash')]: '0xREF_AT',
			[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'status')]: 'Ongoing',
			[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'confirmationStartedAtBlockNumber')]: 32_442_000n,
			[entityFieldAddressKey(EntityType.PolkadotReferendum_Timestamp, [], 'enactmentAtBlockNumber')]: 32_450_000n,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/pallets/on-going-referenda')
	})

	it('lists ongoing referenda with exact offset, limit and count', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xREF_AT',
				height: '32442435',
			},
			referenda: [
				{ id: '1284' },
				{ id: '1285' },
				{ id: '1286' },
			],
		})))
		const snapshot = await networkReferendumListResolver.resolve.Slug.resolve({
			slug: 'polkadot',
		}, {
			...context,
			pagination: {
				limit: 1,
				offset: 1,
			},
		})
		expect(networkReferendumListResolver.projections.Polkadot.$$referenda.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'polkadot',
					},
					referendumId: '1285',
				},
			},
		])
		expect(networkReferendumListResolver.projections.Polkadot.$$referenda.resolveCount(snapshot)).toBe(3)
	})

	it('rejects duplicate referendum identities instead of collapsing list state', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xREF_AT',
				height: '32442435',
			},
			referenda: [
				{ id: '1284' },
				{ id: '1284' },
			],
		})))
		await expect(networkReferendumListResolver.resolve.Slug.resolve({
			slug: 'polkadot',
		}, context)).rejects.toThrow('ongoing referenda contain duplicate identities')
	})

	it('restores Polkadot validator stash resolution from the staking list', async () => {
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
		}, context)).resolves.toEqual({
			stashAccountId,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/pallets/staking/validators')
	})

	it('lists the canonical current validator identities with exact pagination and count', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			validators: [
				{
					stashId: '15Stash',
				},
				{
					accountId: '15Account',
				},
				{
					address: '15Address',
				},
			],
		})))
		const snapshot = await networkValidatorListResolver.resolve.Slug.resolve({
			slug: 'polkadot',
		}, {
			...context,
			pagination: {
				limit: 1,
				offset: 1,
			},
		})
		expect(networkValidatorListResolver.projections.Polkadot.$$validators.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'polkadot',
					},
					stashAccountId: '15Account',
				},
			},
		])
		expect(networkValidatorListResolver.projections.Polkadot.$$validators.resolveCount(snapshot)).toBe(3)
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/pallets/staking/validators')
	})

	it('rejects missing or duplicate current validator identities', async () => {
		for (const validators of [
			[{}],
			[
				{ stashId: '15Duplicate' },
				{ accountId: '15Duplicate' },
			],
		]) {
			sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
				validators,
			})))
			await expect(networkValidatorListResolver.resolve.Slug.resolve({
				slug: 'polkadot',
			}, context)).rejects.toThrow(/missing account identity|duplicate identities/)
		}
	})
})
